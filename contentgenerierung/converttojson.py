##parse a txt document with pairs of questions/answers seperated with semicolons to json

import re
import json
from time import gmtime, strftime

regDevider = r'([\s\S]*?);([\s\S]*?);\n'

quests = list()

tags = '"english 3/4 definitions"'
filename = 'english_3_4_definitions'

inFile = open(filename + ".txt", "r")
outFile = open(filename + ".json", "w")
test = []

quests = re.findall(regDevider, inFile.read())
#print(quests[0])
#print("\nAnzahl Fragen: ")
#print(len(quests))



def writeJson():
    global outFile
    global quests
    global test

##    outFile.write('{"cards: [')
    test.append('{"cards": [')

    for x in quests[:-1]:
        answ = re.sub(r'\n{2,}', '\n', x[1])
        #tmp = re.sub(r'\n\z', '', tmp)
        test.append('{')
        test.append('"_id": "",')
        test.append('"answer": ' + json.dumps(answ) + ',')
        test.append('"created": "' + strftime("%a, %d %b %Y %H:%M:%S GMT", gmtime()) + '",')
        test.append('"createdSemester": "SS 20",')
        test.append('"created_by": "schneiderpa77403@th-nuernberg.de",')
        test.append('"latest": "true",')
        test.append('"question": ' + json.dumps(x[0]) + ',')
        test.append('"tags": [' + tags + '],')
        test.append('"version": 1')
        test.append('},')
##        outFile.write('{')
##        outFile.write('"id: ",')
##        outFile.write('"answer": "' + x[0][1] + '",')
##        outFile.write('"created": "Thu, 21 May 2020 18:46:00 GMT",')
##        outFile.write('"createdSemester": "SS 20",')
##        outFile.write('"created_by": "schneiderpa77403@th-nuernberg.de",')
##        outFile.write('"latest": "true",')
##        outFile.write('"question": "' + x[0][0] + '",')
##        outFile.write('"tags": ["Englisch"],')
##        outFile.write('"version": "1"')
##        outFile.write('},')


    #append last element without following ,
        
    answ = re.sub(r'\n{2,}', '\n', quests[-1][1])
    test.append('{')
    test.append('"_id": "",')
    test.append('"answer": ' + json.dumps(answ) + ',')
    test.append('"created": "Thu, 21 May 2020 18:46:00 GMT",')
    test.append('"createdSemester": "SS 20",')
    test.append('"created_by": "schneiderpa77403@th-nuernberg.de",')
    test.append('"latest": "true",')
    test.append('"question": ' + json.dumps(quests[-1][0]) + ',')
    test.append('"tags": ["Englisch"],')
    test.append('"version": 1')
    test.append('}')
        
    #test = re.sub(r',\z', '', test)
    test.append(']}')
##    outFile.write(']}')
    tmp = ''.join(test)
#    print(tmp)
    outFile.write(tmp)



    
def main():
    global outFile
    global inFile
    writeJson()
    outFile.close
    inFile.close

if __name__ == '__main__':
    main()
