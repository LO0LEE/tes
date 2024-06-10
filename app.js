function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: corsHeaders,
    })
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}
async function handleRequest(request) {
  let u = request.url
  let ru = u.split("?url=")
  if (checkURL(ru[1])) {
    let url = new URL(ru[1])

    let r = new Request(url, request);
    let response =  fetch(r, {
        headers: {
          'User-Agent': 'Cloudflare Workers'
        }
      })
    return response
  }else{
    return ReturnError()
  }
}
addEventListener('fetch', event => {
  const request = event.request
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptions(request))
  } else if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    event.respondWith(handleRequest(request))
  } else {
    event.respondWith(async () => {
      return ReturnError()
    })
  }
})
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Expose-Headers': 'Captcha',
  "Access-Control-Allow-Credentials": true
}
function checkURL(URL) {
	var str=URL;
	//判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
	//下面的代码中应用了转义字符"\"输出一个字符"/"
	var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var objExp=new RegExp(Expression);
	if(objExp.test(str)==true){
		return true;
	}else{
		return false;
	}
}
function ReturnError() {
	let response = new Response("参数错误", {
          status: 405,
          statusText: 'Method Not Allowed',
        })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.append('Vary', 'Origin')
    return response
}
