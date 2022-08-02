var txtfile = "";
var currentID = "";
var maxID = 0;
var stringNumber = -1;
var selectedNo = 0;
var stringToSearch = '';
var stringToReplace = '';
var replaceType = '';
var epgText = '';
let groupNames = new Array();
const saveToFile = async (str) => {
const blob = new Blob([str], {type: 'text/plain'});
const fh = await window.showSaveFilePicker();
const ws = await fh.createWritable();
await ws.write(blob);
await ws.close();
}
const loadFromFile = async (str) => {
const [fileHandle] = await window.showOpenFilePicker();
const file = await fileHandle.getFile();

txtfile = await file.text();
// replacing 0D 0A -> 0A
txtfile = txtfile.replace(/\r/g,'')
//searching TV-Guide
var startPos = txtfile.indexOf('url-tvg="');
if (startPos > 1)
{
var endPos =  txtfile.indexOf('"', startPos + 9);
var tvGuideURL = txtfile.slice(startPos + 9, endPos);
document.getElementById('tvg').value = tvGuideURL;
}
//searching Icons URL
startPos = txtfile.indexOf('tvg-logo="');
if (startPos > 1)
{
endPos =  txtfile.indexOf('"', startPos + 10);
var iconsURL = txtfile.slice(startPos + 10, endPos);
endPos = iconsURL.lastIndexOf('/');
iconsURL = iconsURL.slice(0, endPos + 1);
document.getElementById('iconUrl').value = iconsURL;
}
//Splitting strings to tags
var strings = txtfile.split('#EXTINF');
//Deleting string number 0
strings.splice(0,1);
//Parsing strings
var lastMaxid = maxID;
strings.forEach(function(item, index, array) {
  var tbodyRef = document.getElementById('mainTbl').getElementsByTagName('tbody')[0];
// Insert a row at the end of table
var newRow = tbodyRef.insertRow();
// Insert a cell at the end of the row
// parsing ID
var idCell = newRow.insertCell();
idCell.className = "mc";
// Append a text node to the cell
maxID = index + 1 + lastMaxid;
currentID = 'x'+ String(index + 1 + lastMaxid);
var idText = document.createTextNode(String(index + 1 + lastMaxid));
idCell.appendChild(idText);
idCell.setAttribute('id', currentID);
newRow.setAttribute('id','z'+ String(index + 1 + lastMaxid));
idCell.setAttribute('onclick', 'selectChannel("'+ currentID +'")');
// parsing Name of channel
startPos = item.lastIndexOf(',');
if (startPos > 0)
   {
   if (item.lastIndexOf('#EXTGRP:') > 1)  endPos =  item.lastIndexOf('#EXTGRP:');
   else endPos =  item.lastIndexOf('http');
   if (endPos < 1) endPos = item.lastIndexOf('udp:');
   var newChName =  document.createTextNode(String(item.slice(startPos + 1, endPos - 1)));   
   }  
  else newChName = document.createTextNode(String(''));
var nameCell = newRow.insertCell();
nameCell.className = "ml";
nameCell.appendChild(newChName);
currentID = 'n'+ String(index + 1 + lastMaxid);
nameCell.setAttribute('id', currentID);
nameCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
// parsing group of channel
if (item.lastIndexOf('#EXTGRP:') > 1)
   {
    startPos = item.lastIndexOf('#EXTGRP:');
    if (startPos > 0)
   {
   endPos =  item.indexOf('http',startPos + 7);
   var txtName = String(item.slice(startPos + 8, endPos));
   var newGroupName =  document.createTextNode(txtName);
   if (!contains(groupNames, txtName)) groupNames.push(txtName); 
   }  
   else newGroupName = document.createTextNode(String(''));
   }
else
   {
    startPos = item.lastIndexOf('group-title="');
    if (startPos > 0)
   {
   endPos =  item.indexOf('"',startPos +13);
   var txtName = String(item.slice(startPos + 13, endPos));
   var newGroupName =  document.createTextNode(txtName);
   if (!contains(groupNames, txtName)) groupNames.push(txtName); 
   }  
   else newGroupName = document.createTextNode(String(''));
   }
    
var groupCell = newRow.insertCell();
groupCell.className = "mc";
groupCell.appendChild(newGroupName);
currentID = 'g'+ String(index + 1 + lastMaxid);
groupCell.setAttribute('id', currentID);
groupCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
// parsing icon of channel
startPos = item.lastIndexOf('tvg-logo="');  
if (startPos > 0)
   {
   endPos =  item.indexOf('"',startPos + 10);
var newIconName =  String(item.slice(startPos + 10, endPos));
   }  
  else newIconName = '';
var iconCell = newRow.insertCell();
iconCell.className = "mc";
var oImg = document.createElement("img");
if (newIconName != '') oImg.setAttribute('src', newIconName);
//else oImg.setAttribute('src', '');
oImg.setAttribute('alt', newIconName);
oImg.setAttribute('title', newIconName);
oImg.setAttribute('width', '50%');
document.body.appendChild(oImg);
iconCell.appendChild(oImg);
currentID = 'i'+ String(index + 1 + lastMaxid);
iconCell.setAttribute('id', currentID);
iconCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
// parsing TVG-names of channels
startPos = item.lastIndexOf('tvg-name="');  
if (startPos > 0)
   {
   endPos =  item.indexOf('"', startPos + 11);
   var newTVGName =  document.createTextNode(String(item.slice(startPos + 10, endPos)));   
   }  
  else newTVGName = document.createTextNode(String(''));
var tvgCell = newRow.insertCell();
tvgCell.className = "ml";
tvgCell.appendChild(newTVGName);
currentID = 't'+ String(index + 1 + lastMaxid);
tvgCell.setAttribute('id', currentID);
tvgCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
// parsing URLs of channels
if (item.lastIndexOf('http') > 0) startPos = item.lastIndexOf('http');
if (item.lastIndexOf('udp') > 0) startPos = item.lastIndexOf('udp');
if (startPos > 0)
   {
   endPos =  item.indexOf('"', startPos + 5);
   var newURLName =  document.createTextNode(String(item.slice(startPos, endPos)));   
   }  
  else newURLName = document.createTextNode(String(''));
var urlCell = newRow.insertCell();
urlCell.className = "ml";
urlCell.appendChild(newURLName);
currentID = 'u'+ String(index + 1 + lastMaxid);
urlCell.setAttribute('id', currentID);
urlCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
});
}

//https://habr.com/ru/company/timeweb/blog/653703/?ysclid=l5qloe29gj949870806

    function fncSave()
    {
        txtfile = "";
        txtfile = txtfile + '#EXTM3U url-tvg="';
        txtfile = txtfile + document.getElementById('tvg').value;
        txtfile = txtfile + '" m3uautoload=1\n';
        //while line is exist:
        var i = 1;
        var currString = '';
        while (document.getElementById('t' + i)!= null)
        {
        txtfile = txtfile + '#EXTINF:-1 ';
        currString = document.getElementById('g' + i).innerHTML;
        if (currString != '') txtfile = txtfile + 'group-title="' + currString + '" ';
        currString = document.getElementById('i' + i).firstChild.src;
        if (currString != '') txtfile = txtfile + 'tvg-logo="' + document.getElementById('i' + i).firstChild.src + '" ';
        currString = document.getElementById('t' + i).innerHTML;
        if (currString != '') txtfile = txtfile + 'tvg-name="' + currString + '" ';
        txtfile = txtfile + ',';
        currString = document.getElementById('n' + i).innerHTML;
        if (currString != '') txtfile = txtfile + currString;
        txtfile = txtfile + '\n';
        currString = document.getElementById('u' + i).innerHTML;
        if (currString != '') txtfile = txtfile + currString;
        txtfile = txtfile + '\n';
        i++;
        }
        saveToFile (txtfile);
    }
    function fncLoad()
    {    
        loadFromFile (txtfile);
    }
    function changeName(currID)
    {
        if (currID.charAt(0) == 'n') document.getElementById('chName').innerHTML  = 'Name of channel:';
        if (currID.charAt(0) == 't') document.getElementById('chName').innerHTML = 'Name of Teleguide Channel:';
        if (currID.charAt(0) == 'i') document.getElementById('chName').innerHTML = 'Name of Icon image:';
        if (currID.charAt(0) == 'u') document.getElementById('chName').innerHTML = 'URL of Channel:';
        if (currID.charAt(0) == 'g') {
            document.getElementById('chName').innerHTML = 'Name the Group of Channel:';
            groupNames.forEach(function(item, index, array) {
            var listGroups = document.getElementById('list');
            radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('value', item);
            radioInput.setAttribute('id', 'l' + index);
            radioInput.setAttribute('onclick', 'copyValue("' + item + '");');
            var listLabel = document.createElement('label');
            listLabel.setAttribute('for', '"l' + index + '"');
            listLabel.innerHTML = item + ' ';
            listGroups.appendChild(radioInput);
            listGroups.appendChild(listLabel);
            });
        }
        document.getElementById(currID).style.background = '#ff7';   
        document.getElementById('standchange').style.visibility='visible';        
        if (currID.charAt(0) != 'i') document.getElementById('chVal').value = document.getElementById(currID).innerHTML;
        else  document.getElementById('chVal').value = document.getElementById(currID).firstChild.src;
        currentID = currID;
    }
    function copyValue(labID)
    {        
     document.getElementById('chVal').value = labID;   
    }
    
    function enterChanges()
    {
        document.getElementById('standchange').style.visibility='hidden';
        document.getElementById(currentID).style.background = '#eee';
        if (currentID.charAt(0) != 'i') document.getElementById(currentID).innerHTML = document.getElementById('chVal').value;
        else document.getElementById(currentID).firstChild.src = document.getElementById('chVal').value;
        //destroying labels
        document.getElementById('list').innerHTML = '';
    }
    function contains(arr, elem) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return true;
        }
      }
    return false;
    }
    function selectChannel(currID)
    {
       if (currID.charAt(0) == 'x')
       {
        stringNumber = currID.slice(1);        
        if (selectedNo != stringNumber)
        {
          //select  
          toGreen(stringNumber);
          if (selectedNo > 0) toGrey(selectedNo);
          selectedNo = stringNumber;
        }
       
       else
       {
         //deselect
         toGrey(stringNumber);
         selectedNo = 0;
         stringNumber = -1;
       }
     }    
    }
    function fnUp()
    {
        stringNumber = parseInt(stringNumber, 10);
        selectedNo = parseInt(selectedNo, 10);
        if((stringNumber > 1)&&(stringNumber == selectedNo))
        {
           //console.log(stringNumber);
           //console.log(selectedNo);
           var temp =  document.getElementById('n' + (stringNumber - 1)).innerHTML;      
           document.getElementById('n' + (stringNumber - 1)).innerHTML = document.getElementById('n' + stringNumber).innerHTML;
           document.getElementById('n' + stringNumber).innerHTML = temp;
           
           temp =  document.getElementById('g' + (stringNumber - 1)).innerHTML;      
           document.getElementById('g' + (stringNumber - 1)).innerHTML = document.getElementById('g' + stringNumber).innerHTML;
           document.getElementById('g' + stringNumber).innerHTML = temp;

           temp =  document.getElementById('i' + (stringNumber - 1)).innerHTML;      
           document.getElementById('i' + (stringNumber - 1)).innerHTML = document.getElementById('i' + stringNumber).innerHTML;
           document.getElementById('i' + stringNumber).innerHTML = temp;

           temp =  document.getElementById('t' + (stringNumber - 1)).innerHTML;      
           document.getElementById('t' + (stringNumber - 1)).innerHTML = document.getElementById('t' + stringNumber).innerHTML;
           document.getElementById('t' + stringNumber).innerHTML = temp;
         
           temp =  document.getElementById('u' + (stringNumber - 1)).innerHTML;      
           document.getElementById('u' + (stringNumber - 1)).innerHTML = document.getElementById('u' + stringNumber).innerHTML;
           document.getElementById('u' + stringNumber).innerHTML = temp;
           
           toGrey(selectedNo);          
           selectedNo--;
           toGreen(selectedNo);
           stringNumber = selectedNo;
        }
    }
    
    
 function fnDown()
    {
        stringNumber = parseInt(stringNumber, 10);
        selectedNo = parseInt(selectedNo, 10);
        if((stringNumber > 0)&&(stringNumber == selectedNo)&&(stringNumber < maxID))
        {
           //console.log(stringNumber);
           //console.log(selectedNo);
           var temp =  document.getElementById('n' + (stringNumber + 1)).innerHTML;        
           document.getElementById('n' + (stringNumber + 1)).innerHTML = document.getElementById('n' + stringNumber).innerHTML;
           document.getElementById('n' + stringNumber).innerHTML = temp;
           
           temp =  document.getElementById('g' + (stringNumber + 1)).innerHTML;      
           document.getElementById('g' + (stringNumber + 1)).innerHTML = document.getElementById('g' + stringNumber).innerHTML;
           document.getElementById('g' + stringNumber).innerHTML = temp;

           temp =  document.getElementById('i' + (stringNumber + 1)).innerHTML;      
           document.getElementById('i' + (stringNumber + 1)).innerHTML = document.getElementById('i' + stringNumber).innerHTML;
           document.getElementById('i' + stringNumber).innerHTML = temp;

           temp =  document.getElementById('t' + (stringNumber + 1)).innerHTML;      
           document.getElementById('t' + (stringNumber + 1)).innerHTML = document.getElementById('t' + stringNumber).innerHTML;
           document.getElementById('t' + stringNumber).innerHTML = temp;
         
           temp =  document.getElementById('u' + (stringNumber + 1)).innerHTML;      
           document.getElementById('u' + (stringNumber + 1)).innerHTML = document.getElementById('u' + stringNumber).innerHTML;
           document.getElementById('u' + stringNumber).innerHTML = temp;
           
           toGrey(selectedNo);          
           selectedNo++;
           toGreen(selectedNo);
           stringNumber = selectedNo;
        }
    }      
    function toGreen(sn)
    {
          //select  
          document.getElementById('n' + sn).style.background = '#afa';
          document.getElementById('g' + sn).style.background = '#afa';
          document.getElementById('i' + sn).style.background = '#afa';
          document.getElementById('t' + sn).style.background = '#afa';
          document.getElementById('u' + sn).style.background = '#afa';                  
    }
    function toGrey(sn)
    {
         //deselect
         document.getElementById('n' + sn).style.background = '#eee';
         document.getElementById('g' + sn).style.background = '#eee';
         document.getElementById('i' + sn).style.background = '#eee';
         document.getElementById('t' + sn).style.background = '#eee';
         document.getElementById('u' + sn).style.background = '#eee';       
    }
    function dataReplace(typeData)
    {
          
        document.getElementById('replacechange').style.visibility='visible';        
        if (typeData == 'i') document.getElementById('repF').innerHTML = 'Icon URL string of search:';
        if (typeData == 'u') document.getElementById('repF').innerHTML = 'Channel URL string of search:';
        if (typeData == 'i') document.getElementById('repT').innerHTML = 'Icon URL string to replace:';
        if (typeData == 'u') document.getElementById('repT').innerHTML = 'Channel URL string to replace:';
        replaceType = typeData;
        stringToSearch = document.getElementById('valFrom').value;
        stringToReplace = document.getElementById('valTo').value;        
    }
    function enterReplace()
    {
        stringToSearch = document.getElementById('valFrom').value;
        stringToReplace = document.getElementById('valTo').value; 
        var tempURL = '';
        var startPos = 0;
        if (replaceType == 'i')
        {
           for (var i = 1 ; i <= maxID; i++)
             {
                tempURL = document.getElementById('i'+i).firstChild.src;            
                if (tempURL != '')
                {
                    var startPos = tempURL.indexOf(stringToSearch);
                    if (startPos > 1)
                    {
                     tempURL = tempURL.replace(stringToSearch, stringToReplace);
                     document.getElementById('i'+i).firstChild.src = tempURL;
                    }
                }
             }
        }
        if (replaceType == 'u')
        {
           for (var i = 1 ; i <= maxID; i++)
             {
                tempURL = document.getElementById('u'+i).innerHTML;            
                if (tempURL != '')
                {
                    var startPos = tempURL.indexOf(stringToSearch);
                    if (startPos > 1)
                    {
                     tempURL = tempURL.replace(stringToSearch, stringToReplace);
                     document.getElementById('u'+i).innerHTML = tempURL;
                    }
                }
             }
        }
        document.getElementById('replacechange').style.visibility='hidden'; 
    }
//EPG
//<channel id="3372">
//<display-name lang="ru">STV HD LV</display-name>
//<display-name lang="ru">STV LV</display-name>
//<icon src="http://epg.it999.ru/img2/3372.png"/>
//</channel>
    async function epgTest()
    {
      var tvGuideURL = document.getElementById('tvg').value;  
      try {
           var epgTxt = await fetch(tvGuideURL);
           epgText = await epgTxt.text();
           //console.log (epgText);
           for (i = 1; i <= maxID; i++)
             {
              if (document.getElementById('t' + i).innerHTML !='') currEPG = document.getElementById('t' + i).innerHTML;
              else currEPG = document.getElementById('n' + i).innerHTML;
              stringSearch1 = '<display-name lang="ru">' + currEPG + '</display-name>';
              stringSearch2 = '<display-name lang="en">' + currEPG + '</display-name>';
              //console.log(stringSearch1);
              if ((epgText.indexOf(stringSearch1) > 1) || (epgText.indexOf(stringSearch2) > 1)) document.getElementById('t' + i).style.background = '#afa';
           else document.getElementById('t' + i).style.background = '#faa';
             }           
           }
       catch (err) {
          alert ('Error loading EPG');
          }
    } // try-catch сюда
    
    async function urlTest()
    {
      var chURL = '';  
      for (i = 1; i <= maxID; i++) 
      {
      var chURL = document.getElementById('u' + i).innerHTML;  
      try {
           var urlStatus = await fetch(chURL);
           if (urlStatus.status = 200) document.getElementById('u' + i).style.background = '#afa';
           else document.getElementById('u' + i).style.background = '#faa';
          }
       catch (err) {
          document.getElementById('u' + i).style.background = '#faa';
          }   
      }
    }
    function addCh()
    {
    maxID++;
    currentID = maxID;
    var tbodyRef = document.getElementById('mainTbl').getElementsByTagName('tbody')[0];
    var newRow = tbodyRef.insertRow();
    currentID = 'z'+ String(maxID);
    newRow.setAttribute('id','z'+ maxID);
    var idCell = newRow.insertCell();
    idCell.className = "mc";
    currentID = 'x'+ String(maxID);
    idCell.setAttribute('id',currentID);
    idCell.setAttribute('onclick', 'selectChannel("'+ currentID +'")');
    idCell.innerHTML = maxID;
    var nameCell = newRow.insertCell();
    nameCell.className = "ml";
    currentID = 'n'+ String(maxID);
    nameCell.setAttribute('id',currentID);
    nameCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
    var groupCell = newRow.insertCell();
    groupCell.className = "mc";
    currentID = 'g'+ String(maxID);
    groupCell.setAttribute('id', currentID);
    groupCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
    var iconCell = newRow.insertCell();
    iconCell.className = "mc";
    var oImg = document.createElement("img");
    //oImg.setAttribute('src', '');
    oImg.setAttribute('alt', '');
    oImg.setAttribute('title', '');
    oImg.setAttribute('width', '50%');
    document.body.appendChild(oImg);
    iconCell.appendChild(oImg);
    currentID = 'i'+ maxID;
    iconCell.setAttribute('id', currentID);
    iconCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
    var tvgCell = newRow.insertCell();
    tvgCell.className = "ml";    
    currentID = 't'+ maxID;
    tvgCell.setAttribute('id', currentID);
    tvgCell.setAttribute('onclick', 'changeName("'+ currentID +'")');
    var urlCell = newRow.insertCell();
    urlCell.className = "ml";
    currentID = 'u'+ maxID;
    urlCell.setAttribute('id', currentID);
    urlCell.setAttribute('onclick', 'changeName("'+ currentID +'")');    
    }
    function delCh()
    {
        var i = 0;
        stringNumber = parseInt(stringNumber, 10);
        selectedNo = parseInt(selectedNo, 10);
        if((stringNumber > 0)&&(stringNumber == selectedNo))
        {
          for (i = stringNumber + 1; i <= maxID; i++)
           {
           //console.log(stringNumber);
           //console.log(selectedNo);                 
           document.getElementById('n' + (i - 1)).innerHTML = document.getElementById('n' + i).innerHTML;
           document.getElementById('g' + (i - 1)).innerHTML = document.getElementById('g' + i).innerHTML;
           document.getElementById('i' + (i - 1)).innerHTML = document.getElementById('i' + i).innerHTML;
           document.getElementById('t' + (i - 1)).innerHTML = document.getElementById('t' + i).innerHTML;
           document.getElementById('u' + (i - 1)).innerHTML = document.getElementById('u' + i).innerHTML;
           toGrey(selectedNo);          
           selectedNo++;
           stringNumber = selectedNo;
           }
           document.getElementById('z'+maxID).innerHTML='';
           document.getElementById('z'+maxID).destroy;
           var table = document.getElementById("mainTbl");
           table.deleteRow(maxID);
           maxID--;
           selectedNo = 0;
           stringNumber = -1;
        }
    }
    function autoReplace()
    {
        if (epgText !='')
        {
         var stringSearchEnd = '';
         var chEPG = '';
         var epgName = '';
         var iconName = '';
         var epgIcon = '';
         var icoStart = 0;
         var icoEnd = 0;
         var startPos = 0;
         var endPos = 0;
         var iconSearchStart = '<icon src="';
         var iconSearchEnd ='</channel>';
         for (i = 1; i <= maxID; i++)
             {
              if (document.getElementById('t' + i).innerHTML !='') currEPG = document.getElementById('t' + i).innerHTML;
              else currEPG = document.getElementById('n' + i).innerHTML;
              //currEPG = currEPG.replace(' HD','');
              stringSearch1 = '<display-name lang="ru">' + currEPG;
              stringSearch2 = '<display-name lang="en">' + currEPG;
              stringSearchEnd = '</display-name>';
              //console.log(stringSearch1);
              if (epgText.indexOf(stringSearch1) > 1) startPos = epgText.indexOf(stringSearch1);
              else startPos = epgText.indexOf(stringSearch2);
              //uppercase comparsion
              if (startPos < 1)
              {
               chEPG =  currEPG.toUpperCase();
               stringSearch1 = '<display-name lang="ru">' + chEPG;
               stringSearch2 = '<display-name lang="en">' + chEPG;
               if (epgText.indexOf(stringSearch1) > 1) startPos = epgText.indexOf(stringSearch1);
               else startPos = epgText.indexOf(stringSearch2);
              }
              if (startPos > 1)
              {
                
                endPos = epgText.indexOf(stringSearchEnd, startPos + 24);
                epgName = epgText.slice(startPos + 24, endPos);
                console.log(epgName);
                if (epgName != currEPG) document.getElementById('t' + i).innerHTML = epgName;
                icoStart = epgText.indexOf(iconSearchStart, endPos + 11);
                icoEnd = epgText.indexOf(iconSearchEnd, icoStart + 11);
                iconName = epgText.slice(icoStart + 11, icoEnd - 5);
                console.log(iconName);
                if (document.getElementById('i' + i).firstChild.src =='')
                {
                   document.getElementById('i' + i).firstChild.src = iconName; 
                }
              }
             }    
        }
        else alert('Before using please select the EPG test button.');
    }
