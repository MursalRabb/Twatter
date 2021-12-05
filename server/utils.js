const nodemailer = require('nodemailer')
const Validator = require('Validator')
const jwt = require('jsonwebtoken')

const {prisma} = require('./prisma/connection')

async function main (data) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        connectionTimeout: 1000,
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.PASSWORD, 
        },
      });

      let link = 'http://' + data.domain + '/activate/?token=' + data.activationToken

      
      try {
          let info = await transporter.sendMail({
            from: 'Twatter Info Centre',
            to: data.email,
            subject: 'Activate Your Twatter Account',
            

            html: `
                    <h4>Hi ${data.firstname}!</h4>
                    <br/>
                    <br/>
                    Please click <a href='${link}'>here</a> to activate your account
                    
                    <br/>
                    <br/>
                    Thanks,
                    <br/>
                    Twatter

            `
          })
        return info
      } catch (e) {
        return 'error'
      }

}




function isEmail (data) {
  const rules = {
    email: 'email'
  }

  const messages = {
    email: 'should be an email'
  }

  let v = Validator.make(data, rules, messages)
  v.passes()
  let errors = v.getErrors()
  if (errors.email) {
    return false
  }
  return true

} 


async function isAuthorized (token) {
  
  
  let user
  try {
    let access = token.split(' ')
    access = access[1]
    let privateKey = process.env.SECRET_KEY
    let decoded = jwt.verify(access, privateKey)
    
    user = await prisma.user.findUnique({where: {id: decoded.id}})
    
  } catch (e) {
    return 401
  }
  if (!user) {
    return 401
  }
  
  return user
}


const likedOrNah = async (posts, isAuth) => {
  
  let newPosts = []
  if (isAuth !== 401) {
    
    for (let index = 0; index < posts.length; index++) {
      const element = posts[index]
      let isliked = await prisma.post.findUnique({where: {id: element.id}, select: {likes: {where: {id: isAuth.id}}}})
          let newPost
            if (isliked.likes.length === 0) {
                    newPost = {...element, isLiked: false}
                    newPosts.push(newPost)
                    
                    
                  } else {
                    newPost = {...element, isLiked: true}
                    newPosts.push(newPost)
                  }
    }
  }
 return newPosts
  
  
}



module.exports = {main, isEmail, isAuthorized, likedOrNah}

