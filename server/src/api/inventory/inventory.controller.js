/**
 @author Nikhil Kumar
 @date   13/06/2020
*/

import BuyEntry from '../buyEntry/buyEntry.model';
import Products from '../products/products.model';
import SaleEntry from '../saleEntry/saleEntry.model';

export async function getInventory(req, res) {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    console.log('******************************************************')
    console.log(startDate)
    console.log(endDate)
    console.log(new Date(startDate))
    console.log(new Date(endDate))

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
    }  
    // ,{ $project : { _id : 0 } }
    ,{"$group":{
        _id:'$pid',
        productInfo:'$productInfo'
    }
    }
  
 ])
    return res.status(200).json({
        message: "All Data is between a date range...",
        count: data.length,
        data: data
    })

}