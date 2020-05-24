import requests
import re

regGetLinks = r'<li class=\"mobileFriendlyLink\">[\n\r]{1,2}<a href=\"([^\"]*)\"[^>]*>([^<]*)'
regGetDescription = r'definitionOrSaysContent\">[\n\r]{1,2}<h2>[\n\r]{1,2}([^\n]*)[\S\s]*?description\">([\S\s]*?)</div>'
regRemoveTags = r'<[\S\s]*?>'
regRemoveLeadingSpace = r'^\s*'

url = 'https://www.techopedia.com/dictionary/tags/computer-science'
urlForDesc = 'https://www.techopedia.com'

links = list()
content = list()

output = open("out.txt", "w")

def getLinks():
    global regGetLinks
    global links
    try:
        resp = requests.get(url)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    tmp = re.findall(regGetLinks, resp.text)
    for x in tmp:
        links.append(urlForDesc + x[0])

def getContent():
    global links
    global content
    global output
    for x in links:
        try:
            resp = requests.get(x)
            resp.raise_for_status()
        except requests.exceptions.RequestException as e:
            print("Fehler: " + e)
            continue
        res = re.findall(regGetDescription, resp.text)
        print("length: ")
        print(len(res))
        if len(resp.text) == 0 || len(res) == 0:
            continue
        quest = re.sub(r'<[\S\s]*?>', '', res[0][0])
        description = re.sub(r'<[\S\s]*?>', '', res[0][1])
        description = re.sub(r'^\s*', '', description)
        description = re.sub(r'\.\s{0,1}', '.\n', description)
        content.append((quest, description))
        output.write(quest + ";" + description + ";\n")
        print(quest)
        print("\n\n")
        print(description)
        print("\n\n")
        


def main():
    global output
    getLinks()
    #print(links)
    #print("\n\n")
    getContent()
    #print(content[0][0])
    output.close

if __name__ == '__main__':
    main()
