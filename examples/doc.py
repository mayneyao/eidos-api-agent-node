import requests

"""
- we will get doc markdown by doc id, then create or update doc with the markdown content.
- we copy content of doc(6b7e78d3746c46e0828ec4b655f92032) to a day(2023-08-15).
- if docId like 'yyyy-mm-dd', it will be a daily doc and display in Everyday.
"""

# get doc markdown
r = requests.post('http://localhost:3333/rpc', json={
    'space': 'eidos',
    'method': 'getDocMarkdown',
    'params': ['6b7e78d3746c46e0828ec4b655f92032']
})
data = r.json()
content = data['data']['result']
print(content)

# create or update doc with markdown content from above
r = requests.post('http://localhost:3333/rpc', json={
    'space': 'eidos',
    'method': 'createOrUpdateDocWithMarkdown',
    'params': ['2023-08-15', content]
})
data = r.json()
print(data)
