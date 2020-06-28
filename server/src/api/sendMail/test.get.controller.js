/**
 @author Nikhil Kumar
 @date    21/03/2020
*/

var nodemailer = require('nodemailer');
import users from '../../auth/user.model'
export async function sendMail(req, res) {
    try {
        let data = await users.find({},{email:1,_id:0}).sort({email:1})
        let emailList=[]
        data.forEach(item=>{
            emailList.push(item.email)
                })
        let emailString = emailList.join(', ')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nikhilkumar.egnify@gmail.com',
      pass: 'Egnify123@'
    }
  });
  
  var mailOptions = {
    from: 'nikhilkumar.egnify@gmail.com',
    to:emailString,
    subject: 'testing for review...',
    text: `ok great`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("error ",error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
        return res.status(200).json({
                    message: "This data is sorted by Brand Name",
                    data:data,
                    // info:info.response
                })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error !!!",
            data: { count: 0, items: [] },
        });
    }


}

export default { sendMail };
