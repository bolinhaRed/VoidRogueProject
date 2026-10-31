"""Gera um ficheiro único (void-rogue-standalone.html) com CSS, JS e assets embutidos (data URIs) — útil para testar offline."""
import re,base64,json
r=lambda p:open(p,encoding='utf8').read()
h=r('index.html');h=re.sub(r'<link rel="stylesheet" href="(.*?)">',lambda m:'<style>'+r(m.group(1))+'</style>',h)
def js(m):
    s=r(m.group(1))
    if m.group(1).endswith('assets.js'):s=re.sub(r'"(assets/[^"]+\.png)"',lambda a:'"data:image/png;base64,'+base64.b64encode(open(a.group(1),'rb').read()).decode()+'"',s)
    return '<script>'+s+'</script>'
h=re.sub(r'<script src="(.*?)"></script>',js,h)
open('void-rogue-standalone.html','w',encoding='utf8').write(h);print(len(h)//1024,'KB')
