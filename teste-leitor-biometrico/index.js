
var fpHTTSrvOpEP = "http://127.0.0.1:15170/fpoperation"

var btnCancel;
var fingerFrame;
var submitTemplate;
var submitTemplateForm;
var lastInitOp;

function fixError(statusText, errorText) {
    textResult.style = "color:red"
    
    if(errorText != "") {
        if( statusText != "" ) {
            textResult.innerHTML = errorText + "(" + statusText + ")";
        }
        else {
            textResult.innerHTML = errorText;
        }
    }
    else {
        textResult.innerHTML = statusText
    }
}

function setAskTest(textMes) {
    textResult.style = "color:blue"
    textResult.innerHTML = textMes;
}

function setOperationResult(textMes) {
    textResult.style = "color:green"
    textResult.innerHTML = textMes;
}

function beginOperation(opName,libName, sendSampleNum) {
	var sampleNum = "1"
    if(sendSampleNum) 
		sampleNum = "3"
	
    var json = JSON.stringify({operation: opName, username: "", usedlib: libName, isoconv: "0", samplenum: sampleNum });
    enableControlsForOp(true);

    // var myHeaders = new Headers();
    // myHeaders.append('Content-type', 'application/json');
    // myHeaders.append('charset', 'utf-8');

    // fetch(fpHTTSrvOpEP, {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: json
    //     })
    //     .then(res => {
    //         console.log(res);
    //         setAskTest("Operation begin");
    //         parseOperationDsc(res);
    //     })
    //     .catch(err =>{
    //         fixError(err.statusText || err, "Server response");
		//     enableControlsForOp(false);
    //     })
    // return;

	var req = new XMLHttpRequest();
    req.open("POST", fpHTTSrvOpEP);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    req.onload = function() {
      if (req.status == 200) {
        setAskTest("Operation begin");
        parseOperationDsc(JSON.parse(req.response));
      }
      else {
        fixError(req.statusText, "Server response");
		enableControlsForOp(false);
      }
    };
    req.onerror = function() {
      fixError("", "FPHttpServer not available");
	  enableControlsForOp(false);
    };
    req.send(json);
}

function cancelOperation() {
    var url = fpHTTSrvOpEP + '/' + lastInitOp + '/cancel';
    put(url);
}

function getOperationState(opId) {
    var url = fpHTTSrvOpEP + '/' + opId;

    // fetch(url)
    //     .then(res => {
    //         console.log(res);
	// 		parseOperationDsc(res);
    //     })
    //     .catch(err => {
    //         fixError(err.statusText || "", "Server response");
	// 	    enableControlsForOp(false);
    //     })
    // return;
    var req = new XMLHttpRequest();
    req.open('GET', url);    
    req.onload = function() {
      if (req.status == 200) {
		if( req.readyState == 4 ) {
			parseOperationDsc(JSON.parse(req.response));
		}
      }
      else {
		fixError(req.statusText, "Server response");
		enableControlsForOp(false);
      }
    };
    req.onerror = function() {
		fixError("", "FPHttpServer not available");
		enableControlsForOp(false);
    };
    req.send();
}

function getOperationImg(opId,frameWidth, frameHeight) {
    var url = fpHTTSrvOpEP + '/' + opId + '/image';
    fetch(url)
        .then(res => res.arrayBuffer())
        .then(data =>  {
            console.log(data)
            drawFingerFrame(new Uint8Array(data),opId, frameWidth, frameHeight);		    
        })
        .catch(err =>{
    		enableControlsForOp(false);
        })
    return;
    var req = new XMLHttpRequest();
    req.open('GET', url);    
    req.onload = function() {
      if (req.status == 200) {		
        drawFingerFrame(new Uint8Array(req.response),opId, frameWidth, frameHeight);		
      }
      else {
		enableControlsForOp(false);
      }
    };
    req.onerror = function() {
		enableControlsForOp(false);
    };
    req.send();    
	req.responseType = "arraybuffer";
}

function arrayBufferToBase64( buf ) {
    var binary = '';
    var bytes = buf;
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function submitForm(data){
    submitTemplate.value = arrayBufferToBase64(data);
    submitTemplateForm.submit();
}

function linkOperationTemplate(opId, operationName) {
    var target = "/template";
    var url = fpHTTSrvOpEP + '/' + opId + target;
	var req = new XMLHttpRequest();
    req.open('GET', url);    
    req.onload = function() {
      if (req.status == 200) {
		if( req.readyState == 4 ) {
			submitForm(new Uint8Array(req.response));
		}
      }
      else {
		fixError(req.statusText, "Server response");
		enableControlsForOp(false);
      }
    };
    req.onerror = function() {
		fixError("", "FPHttpServer not available");
		enableControlsForOp(false);
    };
    req.send();
	req.responseType = "arraybuffer";
}

function deleteOperation(opId) {
    var url = fpHTTSrvOpEP + '/' + opId;
    deleteVerb(url);
}

function parseOperationDsc(opDsc) {
    var res = true;
    console.log(opDsc.state);
    if(opDsc.state == 'done') {
        enableControlsForOp(false);

        if(opDsc.status == 'success') {
            setOperationResult(opDsc.message);
            linkOperationTemplate(opDsc.id, opDsc.operation)
        }

        if(opDsc.status == 'fail') {
            fixError("", opDsc.errorstr)
            res = false;
            
            if(parseInt(opDsc.errornum) != -1) {
                deleteOperation(opDsc.id);
            }
        }
    }
    else if(opDsc.state == 'init') {
        lastInitOp = opDsc.id
        setTimeout(getOperationState, 1000, opDsc.id);
        setTimeout(getOperationImg, 1000, opDsc.id, parseInt(opDsc.devwidth), parseInt(opDsc.devheight));
    }
    else if(opDsc.state == 'inprogress')
    {
        if(opDsc.fingercmd == 'puton') {
            setAskTest("Put finger on scanner");
        }

        if(opDsc.fingercmd == 'takeoff') {
            setAskTest("Take off finger from scanner");
        }

        setTimeout(getOperationState, 1000, opDsc.id);
        setTimeout(getOperationImg, 1000, opDsc.id, parseInt(opDsc.devwidth), parseInt(opDsc.devheight));
    }

    return res;
}

function drawFingerFrame(frameBytes,opId, frameWidth, frameHeight) {
    var ctx = fingerFrame.getContext('2d');
    var tempCanvas=document.createElement("canvas");
    tempCanvas.width = frameWidth;
    tempCanvas.height = frameHeight;
    var tempCtx=tempCanvas.getContext("2d");
    var imgData= tempCtx.createImageData(frameWidth,frameHeight);
    for(var i = 0; i < frameBytes.length; i++) {
      // red
      imgData.data[4*i] = frameBytes[i];
      // green
      imgData.data[4*i + 1] = frameBytes[i];
      // blue
      imgData.data[4*i + 2] = frameBytes[i];
      //alpha
      imgData.data[4*i + 3] = 255;
    }
    tempCtx.putImageData(imgData, 0, 0, 0, 0, frameWidth,frameHeight);
    ctx.drawImage(tempCanvas,0,0,frameWidth,frameHeight,0,0,fingerFrame.width,fingerFrame.height);
}


function deleteVerb(url) {
	var req = new XMLHttpRequest();
	req.open("DELETE", url);
	req.onload = function() {
	  if (req.status == 200) {
	  }
	  else {
		fixError(req.statusText, "Server response");
	  }
	};
	req.onerror = function() {
	  fixError("", "FPHttpServer not available");
	};
	req.send();  
}

function put(url) {
    var req = new XMLHttpRequest();
    req.open('PUT', url);
    req.onload = function() {
      if (req.status != 200) {
        fixError(req.statusText, "Server response");
      }
    };
    req.onerror = function() {
      fixError("", "FPHttpServer not available");
    };
    req.send();
}

function enableControlsForOp(opBegin) {
    btnCancel.disabled = !opBegin
}

function CheckFPHttpSrvConnection(operationType)
{
    var req = new XMLHttpRequest();
    req.open('GET', fpHTTSrvOpEP);    
    req.onload = function() {
      if (req.status == 200) {
		btnCancel.disabled = false;
		if( operationType == 1 )
			beginOperation('enroll', 'ftrapi', true);
		else if( operationType == 2 )
			beginOperation('enroll', 'ftrapi', false);
      }
      else {
		fixError(req.statusText, "Server response")
      }
    };
    req.onerror = function() {
		fixError("", "FtrScanHttpServer not available");
		setTimeout(CheckFPHttpSrvConnection, 1000);
    };
    req.send();
}

function onBodyLoad(operationType)
{
    btnCancel = document.getElementById("btnCancel");
    textResult =   document.getElementById("result");
    fingerFrame = document.getElementById("fingerframe");
    submitTemplate = document.getElementById("fptemplate");
	submitTemplateForm = document.getElementById("scanform");

    var defImg = new Image();

    defImg.onload = function() {
        var context = fingerFrame.getContext('2d');
        context.drawImage(defImg, 0, 0);
    };
    defImg.src = "futronic.png";

    CheckFPHttpSrvConnection(operationType);
}
