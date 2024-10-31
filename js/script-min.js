/**
 * Read Database
 * 
 * 
 * @package WordPress
 * @subpackage read database
 * @author Rahul Naik <rahul.naik@prdxn.com>
 */

/*
 * HANDLEAJAX
 * 
 * @author Rahul Naik
 * @type script_L4.obj|Function
 */
var HANDLEAJAX=function(t){var a={},e={};return a.e=function(e,r){var n={action:"view",secure:t("#secure").val(),table_name:e};a.s(n,r)},a.s=function(e,r){t.ajax({type:"POST",url:t("#ajax-path").val(),data:e,success:function(t){a[r](t)}})},a.r=function(a){var e,r="",n=[];a=t.parseJSON(a),a?(r+='<tr class="dbtable_wrapper display">',t.each(a,function(a,e){return t.each(e,function(t,a){r+='<th class="user_id">'+t+"</th>",n.push(t)}),!1}),r+="</tr>",t("#rd-table thead").html(r),t("#rd-table tfoot").html(r),t.each(a,function(a,r){e+='<tr class="dbtable_wrapper">',t.each(n,function(t,a){e+='<td class="user_id">'+r[a]+"</td>"}),e+="</tr>"}),t(".rd_data tbody").html(""),t(".rd_data tbody").html(e),t(".rd_data").tablesorter(),t(".rd_msg").html("(click on column head to sort column.)")):(e+='<tr class="dbtable_wrapper">',e+='<td class="user_id"> No Data Available in this table. </td>',e+="</tr>",t(".rd_data tbody").html(e),t(".rd_data thead").html(""),t(".rd_data tfoot").html(""),t(".rd_msg").html(""))},a.c=function(t){return""==t?void alert("There is no data available in this table"):void a.z(t,"Report",!0)},a.z=function(t,a,e){var r="intfect"!=typeof t?JSON.parse(t):t,n="";if(n+=a+"\r\n\n",e){var d="";for(var l in r[0])d+=l+",";d=d.slice(0,-1),n+=d+"\r\n"}for(var o=0;o<r.length;o++){var d="";for(var l in r[o])d+='"'+r[o][l]+'",';d.slice(0,d.length-1),n+=d+"\r\n"}if(""==n)return void alert("Invalid data");var c="MyReport_";c+=a.replace(/ /g,"_");var i="data:text/csv;charset=utf-8,"+escape(n),s=document.createElement("a");s.href=i,s.style="visibility:hidden",s.download=c+".csv",document.body.appendChild(s),s.click(),document.body.removeChild(s)},e.displayTable=function(t){a.e(t,"r")},e.downloadCsv=function(t){a.e(t,"c")},e}(jQuery);jQuery(document).ready(function(t){t("select#rd_dropdown").change(function(){var a=t(this).children("option:selected").val();HANDLEAJAX.displayTable(a)}),t(window).load(function(){var a=t("select#rd_dropdown").children("option:selected").val();HANDLEAJAX.displayTable(a)}),t("#downloadcsv").click(function(a){a.preventDefault();var e=t(this).siblings("select").children("option:selected").val();HANDLEAJAX.downloadCsv(e)})});