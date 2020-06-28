/**
 @author Nikhil Kumar
 @date    21/03/2020
*/

import SaleEntry from './saleEntry.model';
import BuyEntry from '../buyEntry/buyEntry.model';
import Products from '../products/products.model';
var mongoose = require('mongoose'); 

export async function postSaleEntry(req, res) {
    try {
        console.log('body', req.body)
        if (!req.body.length) {
            return res.status(400).json({
                message: "No Content Recieved From req.body",
                error: { errorCount: 0, errorData: [] },
                upsert: { correctCount: 0, upsertData: [] },
            })
        }
        let errorResArray = []
        let rightResInsertArray = [];
        let rightResUpdateArray = [];
        req.body.forEach(item => {
            console.log('item', item.unit)
            let flagIfSomethingIsMissing = false;
            let errObj = {}
            if (!item.pid) {
                flagIfSomethingIsMissing = true
                errObj['pid'] = "pid is missing"
            }
            if (!item.unit) {
                flagIfSomethingIsMissing = true
                errObj['unit'] = "unit is missing"
            }
            if (!item.perUnitPrice) {
                flagIfSomethingIsMissing = true
                errObj['perUnitPrice'] = "perUnitPrice is missing"
            }
            if (!item.perUnitPrice && !item.unit) {
                flagIfSomethingIsMissing = true
                errObj['total'] = "total can't calculate because unit or unitPrice is missing..."
            }
            if (!item.date) {
                flagIfSomethingIsMissing = true
                errObj['date'] = "date is missing"
            }
            if (!req.userCxt.name) {
                flagIfSomethingIsMissing = true
                errObj['addedBy'] = "addedBy is missing"
            }
            if (flagIfSomethingIsMissing) {
                item["errors"] = errObj
                errorResArray.push(item)
            } else {
                item['addedBy'] = req.userCxt.name;
                item['total'] = item.perUnitPrice * item.unit;
                if(typeof item._id!=='undefined')
                    rightResUpdateArray.push(item);
                else
                    rightResInsertArray.push(item);
            }
        });
        let insertedRecords  = await SaleEntry.insertMany(rightResInsertArray);
        let updateSales=[];
        rightResUpdateArray.forEach(sale=>{
          let obj=  {
                updateOne: {
                  filter: { _id: mongoose.Types.ObjectId(sale._id) },
                  update: sale ,
                  upsert: false
                }
              }
              updateSales.push(obj);
        });
        let bulkUpdate = await SaleEntry.bulkWrite(updateSales);
        if (errorResArray.length) {
            return res.status(206).json({
                message: "Some Entry Have Errors",
                error: { errorCount: errorResArray.length, errorData: errorResArray },
                upsert: { correctCount: rightResInsertArray.length, upsertData: rightResInsertArray,bulkUpdateCount:bulkUpdate.length,bulkUpdate:bulkUpdate},
            })
        }
        return res.status(200).json({
            message: "All Data Inserted",
            error: { errorCount: errorResArray.length, errorData: errorResArray },
            upsert: { correctCount: rightResInsertArray.length, upsertData: rightResInsertArray ,bulkUpdateCount:bulkUpdate.length,bulkUpdate:bulkUpdate},
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
            error: { errorCount: 0, errorData: [] },
            upsert: { correctCount: 0, upsertData: [] },
        });
    }


}
export async function getSaleEntry(req, res) {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if (!startDate || !endDate) {
        return res.status(400).json({
            message: "startDate/endDate is missing",
            data: [],
        })
    }
    let data = await SaleEntry.aggregate([{
            "$match": {
                "created_at": { "$gte": new Date(startDate), "$lte": new Date(endDate) }
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "pid",
                "foreignField": "_id",
                "as": "productInfo"
            }
        }
    ])
    return res.status(200).json({
        message: "All Data is between a date range...",
        count: data.length,
        data: data,
    })

}
export async function updateSaleEntry(req, res) {
    try {
        console.log('req.body', req.body)
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                message: "No Content Recieved For Update...",
                data: []
            })
        }
        if (req.body.unit && req.body.perUnitPrice) {
            req.body.total = req.body.perUnitPrice * req.body.unit
        }
        SaleEntry.findOneAndUpdate({ _id: req.body.id },
            req.body, { upsert: true, new: true, runValidators: true },
            function(err, doc) {
                if (err) {
                    console.log(err)
                    return res.status(424).json({
                        message: "Operation Failed...",
                        data: doc,
                    })
                }
                return res.status(200).json({
                    message: "Document Updated...",
                    data: doc,
                })
            }
        );

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
        });
    }
}
//Delete Product
export async function deleteSaleEntry(req, res) {
    try {
        console.log('req.params.id', req.params.id)
        if (!req.params.id) {
            return res.status(400).json({
                message: "No Id Recieved For Delete...",
                data: []
            })
        }
        SaleEntry.deleteOne({ _id: req.params.id },
            function(err, doc) {
                if (err) {
                    console.log(err)
                    return res.status(424).json({
                        message: "Operation Failed...",
                        data: doc,
                    })
                }
                return res.status(200).json({
                    message: "Document Deleted...",
                    data: doc,
                })
            }
        );

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
        });
    }
}

export async function getTodaySaleDetail(req, res) {
    //let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if (!endDate) {
        return res.status(400).json({
            message: "endDate is missing",
            data: [],
        })
    }
    let buyTillLastday = await BuyEntry.aggregate([{
            "$match": {
                "date": { "$lt": new Date(endDate) }
            }
        }, {
            $group: {
                _id: "$pid",
                bunit: {
                    $sum: "$unit"
                },
                bamount: {
                    $sum: "$total"
                }
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "_id",
                "foreignField": "_id",
                "as": "productInfo"
            }
        }
    ]);
    let buytoday = await BuyEntry.aggregate([{
            "$match": {
                "date": { "$eq": new Date(endDate) }
            }
        }, {
            $group: {
                _id: "$pid",
                bunit: {
                    $sum: "$unit"
                },
                bamount: {
                    $sum: "$total"
                }
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "_id",
                "foreignField": "_id",
                "as": "productInfo"
            }
        }
    ]);
    let saleTillLastDay = await SaleEntry.aggregate([{
            "$match": {
                "date": { "$lt": new Date(endDate) }
            }
        },
        {
            $group: {
                _id: "$pid",
                sunit: {
                    $sum: "$unit"
                },
                samount: {
                    $sum: "$total"
                }
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "_id",
                "foreignField": "_id",
                "as": "productInfo"
            }
        }
    ]);
    let saleToday = await SaleEntry.aggregate([{
            "$match": {
                "date": { "$eq": new Date(endDate) }
            }
        },
        {
            $group: {
                _id: "$pid",
                sunit: {
                    $sum: "$unit"
                },
                samount: {
                    $sum: "$total"
                }
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "_id",
                "foreignField": "_id",
                "as": "productInfo"
            }
        }
    ]);
    let myData = {
        buydata: buyTillLastday,
        saledata: saleTillLastDay,
        buytoday: buytoday,
        saletoday: saleToday
    }
    return res.status(200).json({
        message: "All Data is between a date range...",
        //count: data.length,
        data: myData,
    })

}

export async function getSaleEntries(req, res) {
    let entryDate = req.query.entryDate;
    if (!entryDate) {
        return res.status(400).json({
            message: "entryDate is missing",
            data: [],
        })
    }
    let productList=await Products.find({});
    let saleEntries = await SaleEntry.aggregate([{
            "$match": {
                "date": { "$eq": new Date(entryDate) }
            }
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "pid",
                "foreignField": "_id",
                "as": "productInfo"
            }
        }
    ])
    // console.log("productList ",productList)
    // console.log('saleEntries ',saleEntries)
    let saleEntryResponseData=[];
    productList.forEach(product=>{
        let sale={
            pid: product._id, 
            perUnitPrice : product.salePrice, 
            unit: 0,
            product:product
        }

        saleEntries.forEach(s=>{
            // console.log("p._id ", p._id.toString())
            // console.log("s.pid ", s.pid)

            if(product._id.toString()===s.pid.toString()){
                console.log(product._id,' = ',s.pid)
                sale.unit=s.unit;
                sale._id=s._id;
            }
        });
        saleEntryResponseData.push(sale);
    });

    return res.status(200).json({
        message: "All Data is between a date range...",
        count: saleEntryResponseData.length,
        data: saleEntryResponseData,
    })

}
export default { postSaleEntry, getSaleEntry, updateSaleEntry, deleteSaleEntry, getTodaySaleDetail,getSaleEntries };