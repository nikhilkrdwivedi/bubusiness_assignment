/**
 @author Nikhil Kumar
 @date    21/03/2020
*/

import Product from './products.model';

//add new products
export async function postProducts(req, res) {
    try {
        console.log("body ", req.body)
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
            let flagIfSomethingIsMissing = false;
            let errObj = {}
            if (!item.brand) {
                flagIfSomethingIsMissing = true
                errObj['brand'] = "brand is missing"
            }
            if (!item.sid) {
                flagIfSomethingIsMissing = true
                errObj['sid'] = "sid is missing"
            }
            if (!item.brandId) {
                flagIfSomethingIsMissing = true
                errObj['brandId'] = "brandId is missing"
            }
            if (!item.size) {
                flagIfSomethingIsMissing = true
                errObj['size'] = "size is missing"
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
                item['active'] = typeof(item.active) == 'undefined' ? true : item.active
                rightResArray.push(item)
            }
        });
        rightResArray.forEach((item) => {
            Product.findOneAndUpdate({
                    // brand: item.brand,
                    // size: item.size,
                    sid: item.sid

                },
                item, { upsert: true, new: true, runValidators: true },
                function(err, doc) {
                    if (err) {
                        console.log(err)
                    }
                }
            );
        });
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

//get all products list
export async function getProducts(req, res) {

    let resData = await Product.find().sort({ brandId: 1, size: -1 });
    if (!resData) {
        return res.status(200).json({
            message: "No Data Found...Try to contact admin to add list...",
            data: resData
        })
    }
    return res.status(200).json({
        message: "All Data is sorted by brand...",
        data: resData
    })
}

//Update product
export async function updateProducts(req, res) {
    try {
        console.log('req.body', req.body)
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                message: "No Content Recieved For Update...",
                data: []
            })
        }
        Product.findOneAndUpdate({ _id: req.body.id },
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
export async function deleteProducts(req, res) {
    try {
        console.log('req.params.id', req.params.id)
        if (!req.params.id) {
            return res.status(400).json({
                message: "No Id Recieved For Delete...",
                data: []
            })
        }
        Product.deleteOne({ _id: req.params.id },
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
export default { postProducts, getProducts, updateProducts, deleteProducts };