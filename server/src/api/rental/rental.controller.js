/**
 @author Nikhil Kumar
 @date    28/06/2020
*/

import Book from '../book/book.model';
import Rental from './rental.model'

//Issue Book to User
export async function issueBook(req, res) {
    try {
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                message: "No Book Details Recieved.",
                data: {},
                errObj: req.body
            })
        }

        let book = req.body
        let flagIfSomethingIsMissing = false;
        let errObj = {}
        if (!book.cardHolder) {
            flagIfSomethingIsMissing = true
            errObj['cardHolder'] = "cardHolder is missing"
        }
        if (!book.isbn) {
            flagIfSomethingIsMissing = true
            errObj['isbn'] = "isbn is missing"
        }
        if (!req.userCxt.email) {
            flagIfSomethingIsMissing = true
            errObj['addedBy'] = "addedBy is missing"
        }
        //Return if data is missing
        if (!Object.keys(errObj).length && flagIfSomethingIsMissing) {
            return res.status(206).json({
                message: "Data is missing.",
                data: {},
                errDataMsg: errObj
            })
        }

        //check if book is already issued
        let checkBookStatus = await Rental.find({ isbn: book.isbn, isIssued: true });
        if (checkBookStatus.length) {
            return res.status(405).json({
                message: "This book is already issued",
                data: checkBookStatus,
                errDataMsg: errObj
            })
        }
        book['issuedBy'] = req.userCxt._id
        book['isIssued'] = true

        let issueBookObj = new Rental({
            isbn: book.isbn,
            cardHolder: book.cardHolder,
            isIssued: book.isIssued,
            issuedDate: Date(),
            returnDate: null,
            issuedBy: book.issuedBy

        })
        let issueData = await issueBookObj.save()
        return res.status(200).json({
            message: "Book successfully issued.",
            errDataMsg: errObj,
            data: book,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
            errDataMsg: {},
            data: {},
        });
    }


}

//Return Book
export async function returnBook(req, res) {
    try {
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                message: "No Book Details Recieved.",
                data: {},
                errObj: req.body
            })
        }

        let book = req.body
        let flagIfSomethingIsMissing = false;
        let errObj = {}
        if (!book.cardHolder) {
            flagIfSomethingIsMissing = true
            errObj['cardHolder'] = "cardHolder is missing"
        }
        if (!book.isbn) {
            flagIfSomethingIsMissing = true
            errObj['isbn'] = "isbn is missing"
        }
        if (!req.userCxt.email) {
            flagIfSomethingIsMissing = true
            errObj['addedBy'] = "addedBy is missing"
        }
        //Return if data is missing
        if (!Object.keys(errObj).length && flagIfSomethingIsMissing) {
            return res.status(206).json({
                message: "Data is missing.",
                data: {},
                errDataMsg: errObj
            })
        }

        //check if book is already issued to same user and still not return
        let checkBookStatus = await Rental.find({ isbn: book.isbn, isIssued: true, cardHolder: book.cardHolder });
        if (!checkBookStatus.length) {
            return res.status(405).json({
                message: "This book is not issued to given user.",
                data: checkBookStatus,
                errDataMsg: errObj
            })
        }
        book['returnDate'] = Date()
        book['isIssued'] = false

        let response = await Rental.update({ isbn: book.isbn, isIssued: true, cardHolder: book.cardHolder }, book, { upsert: true });
        return res.status(200).json({
            message: "Book successfully returned.",
            errDataMsg: errObj,
            data: book,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
            errDataMsg: {},
            data: {},
        });
    }


}


//Get getBookHistory
export async function getBookHistory(req, res) {
    try {
        let bookList = await Rental.aggregate([{
                "$lookup": {
                    "localField": "isbn",
                    "from": "books",
                    "foreignField": "isbn",
                    "as": "bookDetails"
                }
            }, {
                "$unwind": {
                    "path": "$bookDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$lookup": {
                    "localField": "cardHolder",
                    "from": "users",
                    "foreignField": "cardNumber",
                    "as": "userData"
                }
            }
        ])
        return res.status(200).json({
            message: "List of All Rental Book with History",
            data: bookList,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
            data: []
        });
    }
}


//Get Book which is issued to someone then isIssuedStatus=true else false
export async function getBooksByLoanOrNot(req, res) {
    try {
        let isIssuedStatus = req.params.isIssuedStatus === 'true' ? true : false
        console.log('req.params.id', typeof isIssuedStatus)
        console.log('req.params.id', isIssuedStatus)


        let bookList = await Rental.aggregate([{
                "$match": {
                    "isIssued": isIssuedStatus
                }
            },
            {
                "$lookup": {
                    "localField": "isbn",
                    "from": "books",
                    "foreignField": "isbn",
                    "as": "bookDetails"
                }
            }, {
                "$unwind": {
                    "path": "$bookDetails",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$lookup": {
                    "localField": "cardHolder",
                    "from": "users",
                    "foreignField": "cardNumber",
                    "as": "userData"
                }
            }
        ])
        return res.status(200).json({
            message: "List of All Rental Books.",
            data: bookList,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
            data: []
        });
    }
}

export default { issueBook, returnBook, getBookHistory, getBooksByLoanOrNot };