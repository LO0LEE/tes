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
	// URL လိပ်စာကို ဆုံးဖြတ်ရန် ပုံမှန်ဖော်ပြချက်မှာ- http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=] *)?
//အောက်ပါကုဒ်သည် စာလုံးတစ်လုံးကို ထုတ်ရန် "\" ကို အသုံးပြုသည်။
	var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var objExp=new RegExp(Expression);
	if(objExp.test(str)==true){
		return true;
	}else{
		return false;
	}
}
function ReturnError() {
	let response = new Response("ကန့်သတ်ချက် အမှား", {
          status: 405,
          statusText: 'Method Not Allowed',
        })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.append('Vary', 'Origin')
    return response
}
