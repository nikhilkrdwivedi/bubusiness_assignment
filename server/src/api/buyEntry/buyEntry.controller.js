/**
 @author Nikhil Kumar
 @date    21/03/2020
*/

import BuyEntry from './buyEntry.model';
import Products from '../products/products.model'

function getGMTdate(DATE) {
    var d2 = new Date(DATE);
    d2.setHours(d2.getHours() + 5)
    d2.setMinutes(d2.getMinutes() + 30);
    return d2
}
export async function postBuyEntry(req, res) {
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
        let rightResArray = []
        req.body.forEach(item => {
            console.log('item', item.unit)
            let flagIfSomethingIsMissing = false;
            let errObj = {}
            if (!item.pid) {
                flagIfSomethingIsMissing = true
                errObj['pid'] = "PID is missing"
            }
            if (!item.unit) {
                flagIfSomethingIsMissing = true
                errObj['unit'] = "unit is missing"
            }
            if (!item.perUnitPrice) {
                flagIfSomethingIsMissing = true
                errObj['perUnitPrice'] = "perUnitPrice is missing"
            }
            if (!item.date) {
                flagIfSomethingIsMissing = true
                errObj['date'] = "date is missing"
            }
            if (!item.perUnitPrice && !item.unit) {
                flagIfSomethingIsMissing = true
                errObj['total'] = "total can't calculate because unit or unitPrice is missing..."
            }
            if (!req.userCxt.name) {
                flagIfSomethingIsMissing = true
                errObj['addedBy'] = "addedBy is missing"
            }
            if (flagIfSomethingIsMissing) {
                item["errors"] = errObj
                errorResArray.push(item)
            } else {
                item['addedBy'] = req.userCxt.name
                item['total'] = item.perUnitPrice * item.unit


                item['date'] = new Date(item.date)
                console.log('New Date' + item.date)
                rightResArray.push(item)
            }
        });
        let response = await BuyEntry.insertMany(rightResArray);
        console.log('res: ', response)
        if (errorResArray.length) {
            return res.status(206).json({
                message: "Some Entry Have Errors",
                error: { errorCount: errorResArray.length, errorData: errorResArray },
                upsert: { correctCount: rightResArray.length, upsertData: rightResArray },
            })
        }
        return res.status(200).json({
            message: "All Data Inserted",
            error: { errorCount: errorResArray.length, errorData: errorResArray },
            upsert: { correctCount: rightResArray.length, upsertData: rightResArray },
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
export async function getBuyEntry(req, res) {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    if (!startDate || !endDate) {
        return res.status(400).json({
            message: "startDate/endDate is missing",
            data: [],
        })
    }
    let data = await BuyEntry.aggregate([{
        "$match": {
            "date": { "$gte": new Date(startDate), "$lte": new Date(endDate) }
        }
    }, {
        "$lookup": {
            "from": "products",
            "localField": "pid",
            "foreignField": "_id",
            "as": "productInfo"
        }
    }])
    return res.status(200).json({
        message: "All Data is between a date range...",
        count: data.length,
        data: data
    })

}
export async function updateBuyEntry(req, res) {
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
        BuyEntry.findOneAndUpdate({ _id: req.body.id },
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
export async function deleteBuyEntry(req, res) {
    try {
        console.log('req.params.id', req.params.id)
        if (!req.params.id) {
            return res.status(400).json({
                message: "No Id Recieved For Delete...",
                data: []
            })
        }
        BuyEntry.deleteOne({ _id: req.params.id },
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
export default { postBuyEntry, getBuyEntry, updateBuyEntry, deleteBuyEntry };