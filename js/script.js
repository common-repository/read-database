/**
 * Read Database
 * 
 * 
 * @package WordPress
 * @subpackage read database
 * @author Rahul Naik <naikrahulda@gmail.com>
 */

/*
 * HANDLEAJAX
 * 
 * @author Rahul Naik
 * @type script_L4.intf|Function
 */
var HANDLEAJAX = (function($) {
    
    /*
     * Defining private interface
     * 
     * @type interface
     */
    var pvt = {};
    
    /*
     * Defining public interface 
     * 
     * @type interface
     */
    var intf  = {};
    
    /*
     * Private method to set AJAX data.
     * 
     * @param string x table name
     * @param string g callback function
     * @returns void
     */
    pvt.e = function (x, g) { 
        var q = {
            action    : "view",
            secure    : $("#secure").val(),
            table_name: x
        };
        pvt.s(q, g); 
    };
    
    /*
     * Private method to send AJAX request and pass response data to callback function
     * 
     * @param array q AJAX data
     * @param string g callback function
     * @returns void
     */
    pvt.s = function (q, g) {
        $.ajax({
            type   : "POST",
            url    : $("#ajax-path").val(),
            data   : q,
            success: function(f) {
                pvt[g](f);
            }
        });
    };

    /*
     * Private Callback method to display data
     * 
     * @param json e AJAX response
     * @returns bool | void
     */
    pvt.r = function (e) { 
        var o, g = '';
        var y = [];
        e = $.parseJSON(e);
        if(e) {
            g += '<tr class="dbtable_wrapper display">';

            $.each(e, function(k, v){
                $.each(v, function(b, a){
                    g += '<th class="user_id">'+ b +'</th>';
                    y.push(b);
                });
                return false;
            });

            g += "</tr>";
            
            $("#rd-table thead").html(g);
            $("#rd-table tfoot").html(g);

            $.each(e, function(k, v) {
                o += '<tr class="dbtable_wrapper">';
                $.each(y, function(b, a){
                    o += '<td class="user_id">'+ v[a] +'</td>';
                });
                o += '</tr>';                           
            });
            
            $(".rd_data tbody").html('');
            $(".rd_data tbody").html(o);
            $(".rd_data").tablesorter();
            $(".rd_msg").html('(click on column head to sort column.)');
        } else {
            o += '<tr class="dbtable_wrapper">';
            o += '<td class="user_id"> No Data Available in this table. </td>';
            o += '</tr>'; 
            $(".rd_data tbody").html(o);
            $(".rd_data thead").html('');
            $(".rd_data tfoot").html('');
            $(".rd_msg").html('');
        }
    };
    
    /*
     * Private method to call json to csv converter and file downloader
     * 
     * @param json e respose
     * @returns void
     */
    pvt.c = function (e) {
        
        // Let's check if response has some data
        if(e == '') {
            alert('There is no data available in this table');
            return;
        }
            
        pvt.z(e, "Report", true);
    };
    
    /*
     * Private method to generate csv file and auto download
     * 
     * @param json JSONData
     * @param string ReportTitle
     * @param bool ShowLabel
     * @returns void
     */
    pvt.z = function (JSONData, ReportTitle, ShowLabel) {
        
        //If JSONData is not an intfect then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'intfect' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';    
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName    += ReportTitle.replace(/ /g,"_");   

        //Initialize file format you want csv or xls
        var uri      = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generate a temp <a /> tag
        var link      = document.createElement("a");    
            link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style    = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    /*
     * Public method to display table
     * 
     * @param string t
     * @returns void
     */
    intf.displayTable = function(t) {
        pvt.e(t, 'r');
    };
    
    /*
     * Public method to download table data as csv
     * 
     * @param string t
     * @returns void
     */
    intf.downloadCsv = function(t) {
        pvt.e(t, 'c');        
    };
    
    // Let's return public interface
    return intf;
    
}(jQuery)); 

jQuery(document).ready(function($) {
   
    /*
     * Content to be change on change of table name in Drop Down.
     */
    $("select#rd_dropdown").change(function() {
        var t = $(this).children("option:selected").val();
        HANDLEAJAX.displayTable(t); 
    });
    
    /*
     * Let's display content from default table on page load. 
     */
    $(window).load(function() {
        var t = $("select#rd_dropdown").children("option:selected").val();
        HANDLEAJAX.displayTable(t);
    });
    
    /*
     * Let's download csv file
     */
    $('#downloadcsv').click(function(e) {
        e.preventDefault();
        var t = $(this).siblings('select').children("option:selected").val();
        HANDLEAJAX.downloadCsv(t);
    }); 
   
// End of document ready
}); 
