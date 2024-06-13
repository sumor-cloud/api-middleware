const style = `<style type="text/css">
html{
    background: #273343;
    color: #fff;
    text-align: center;
    padding: 30px;
}
.title{
    opacity: .6;
    padding-bottom: 10px;
}
.content{
    padding-bottom: 10px;
}
.showDetail{
    margin-top: 20px;
    color: #03a9f4;
    cursor: pointer;
}
.showDetail.show{
    display: none;
}
.detailBox{
    position: relative;
    opacity: 0;
}
.detailBox.show{
    opacity: 1;
}
pre{
    border: 1px solid rgba(255,255,255,.6);
    border-radius: 2px;
    text-align: left;
    height: 50%;
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20px;
    overflow: auto;
    padding: 10px;
}
.detailMessage{
    font-size: 14px;
    width: fit-content;
    margin: 0 auto;
    margin-top: 5px;
}
</style>`

const script = `<script>
function show(){
    var oDiv = document.getElementsByTagName('div')[3];
    oDiv.classList.add('show')
    var oPre = document.getElementsByTagName('div')[4];
    oPre.classList.add('show');
}
</script>`

export default ({ title, code, message, errors }) => {
  let errorsHtml = ''
  if (errors && errors.length > 0) {
    const dataString = JSON.stringify(errors, null, 4)
    errorsHtml = `<div class="detailBox">
    <pre>${dataString}</pre>
    <div class="detailMessage">请将该技术信息提供给应用管理员</div>
</div>`
  }

  return `<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
${style}
</head>
<body>
<h1>${title}</h1>
<div class="title">错误原因</div>
<div class="content">${code}</div>
<div class="content">${message}</div>
<div class="title showDetail" onclick="show()">点击查看详细错误信息</div>
${errorsHtml}
${script}
</body>
</html>`
}
