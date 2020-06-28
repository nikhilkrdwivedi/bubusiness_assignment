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


//Get All Book List
export async function getBooks(req, res) {
    try {
        let allBooks = await Book.find({}).sort({ title: 1 });
        return res.status(200).json({
            message: "All Data is sorted by title",
            count: allBooks.length,
            data: allBooks
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
        });
    }
}

//Get Book By ISBN
export async function getBookByISBN(req, res) {
    try {
        console.log('req.params.id', req.params.isbn)
        let ISBN = req.params.isbn
        if (!ISBN) {
            return res.status(400).json({
                message: "No ISBN Recieved to Query a Book.",
                data: []
            })
        }
        let book = await Book.find({ isbn: ISBN });
        return res.status(200).json({
            message: "Book Found.",
            count: book.length,
            data: book
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
        });
    }
}

export async function updateBook(req, res) {
    try {
        let book = req.body
        console.log('req.body', req.body)
        if (!Object.keys(book).length && !book.isbn) {
            return res.status(400).json({
                message: "No Book Detail or No ISBN  Recieved to Update.",
                data: []
            })
        }

        Book.findOneAndUpdate({ isbn: book.isbn },
            book, { upsert: true, new: true, runValidators: true },
            function(err, doc) {
                if (err) {
                    console.log(err)
                    return res.status(424).json({
                        message: "Operation Failed.",
                        data: doc,
                    })
                }
                return res.status(200).json({
                    message: "Book Updated.",
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

//Delete Book By ISBN
export async function deleteBook(req, res) {
    try {
        let bookISBN = req.params.isbn
        if (!bookISBN) {
            return res.status(400).json({
                message: "No ISBN Recieved For Delete...",
                data: []
            })
        }
        let checkISBN = await Book.findOne({ isbn: bookISBN });

        if (!checkISBN) {
            return res.status(400).json({
                message: "ISBN no is not found",
                data: [],
            })
        }
        Book.deleteOne({ isbn: bookISBN },
            function(err, doc) {
                if (err) {
                    console.log(err)
                    return res.status(424).json({
                        message: "Operation Failed.",
                        data: doc,
                    })
                }
                return res.status(200).json({
                    message: "Book Deleted.",
                    data: checkISBN,
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
export default { issueBook, getBooks, getBookByISBN, updateBook, deleteBook };