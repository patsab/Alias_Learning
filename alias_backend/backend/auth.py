import requests 

request_url='https://git.informatik.fh-nuernberg.de/oauth/userinfo'

#get the email out of the token
def getEmailfromToken(token):
    headers={'authorization': token}
    newToken = requests.get(request_url,headers=headers)
    try:
        data = newToken.json()
        return data['email']
    except:
        return ""

#Return if the userData from the token matches the provided email
def checkAuth(email,token):
    #
    #
    #
    return True
    #
    #
    #
    realMail = getEmailfromToken(token)
    if realMail == email:
        return True
    return False
    
