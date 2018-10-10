/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.65024411895251, "KoPercent": 4.349755881047492};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23945849977807368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5641025641025641, 500, 1500, "Category - Urban Living-0"], "isController": false}, {"data": [0.627906976744186, 500, 1500, "Category - Women"], "isController": false}, {"data": [0.37, 500, 1500, "Product - Makeup Brushes"], "isController": false}, {"data": [0.07, 500, 1500, "Cart-0"], "isController": false}, {"data": [0.205, 500, 1500, "Checkout-1"], "isController": false}, {"data": [0.095, 500, 1500, "Checkout-2"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "Product - Grey Tee"], "isController": false}, {"data": [0.14, 500, 1500, "Checkout-0"], "isController": false}, {"data": [0.21, 500, 1500, "Product - Rose Coloured Glasses"], "isController": false}, {"data": [0.24509803921568626, 500, 1500, "Checkout Login-0"], "isController": false}, {"data": [0.21568627450980393, 500, 1500, "Checkout Login-1"], "isController": false}, {"data": [0.035, 500, 1500, "Checkout"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "Product - Grey Tee-0"], "isController": false}, {"data": [0.21, 500, 1500, "Product - Rose Coloured Glasses-0"], "isController": false}, {"data": [0.5641025641025641, 500, 1500, "Category - Urban Living"], "isController": false}, {"data": [0.295, 500, 1500, "Homepage-0"], "isController": false}, {"data": [0.07, 500, 1500, "Cart"], "isController": false}, {"data": [0.6101694915254238, 500, 1500, "Category - Men"], "isController": false}, {"data": [0.295, 500, 1500, "Homepage"], "isController": false}, {"data": [0.015, 500, 1500, "Add to Cart"], "isController": false}, {"data": [0.37, 500, 1500, "Product - Makeup Brushes-0"], "isController": false}, {"data": [0.06, 500, 1500, "Checkout Login"], "isController": false}, {"data": [0.627906976744186, 500, 1500, "Category - Women-0"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "Product - Audio Film-0"], "isController": false}, {"data": [0.155, 500, 1500, "Checkout Order Information"], "isController": false}, {"data": [0.30392156862745096, 500, 1500, "Checkout Order Information-0"], "isController": false}, {"data": [0.085, 500, 1500, "Add to Cart-1"], "isController": false}, {"data": [0.6101694915254238, 500, 1500, "Category - Men-0"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "Product - Audio Film"], "isController": false}, {"data": [0.135, 500, 1500, "Add to Cart-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2253, 98, 4.349755881047492, 2583.017310252999, 0, 13650, 4709.200000000001, 6948.299999999999, 11238.560000000001, 9.025429839601328, 572.7847372828269, 2.33894910627013], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Category - Urban Living-0", 39, 0, 0.0, 1159.564102564102, 119, 4007, 3007.0, 3609.0, 4007.0, 0.23005863545734476, 20.79967174245821, 0.035272661881643685], "isController": false}, {"data": ["Category - Women", 43, 0, 0.0, 1103.1627906976744, 128, 4576, 3570.2000000000007, 4283.799999999999, 4576.0, 0.2620241671592315, 20.342053888621447, 0.03838244636121555], "isController": false}, {"data": ["Product - Makeup Brushes", 50, 0, 0.0, 1758.7000000000003, 307, 5007, 4052.8999999999996, 4860.5, 5007.0, 0.33326445867853977, 23.167327970969332, 0.050119850230952265], "isController": false}, {"data": ["Cart-0", 100, 0, 0.0, 3120.0300000000007, 441, 5166, 4561.8, 4857.599999999999, 5164.3099999999995, 0.5377963257755023, 34.477891361108725, 0.11816813798778128], "isController": false}, {"data": ["Checkout-1", 100, 0, 0.0, 2429.4600000000005, 163, 5152, 3989.0, 4165.149999999999, 5145.879999999997, 0.5066728818540175, 2.8293722069657385, 0.11528787253123637], "isController": false}, {"data": ["Checkout-2", 100, 0, 0.0, 3050.1599999999994, 433, 5393, 4683.2, 5082.399999999999, 5392.88, 0.5065753480172641, 32.224821147241194, 0.11823389470324816], "isController": false}, {"data": ["Product - Grey Tee", 58, 0, 0.0, 1794.0862068965514, 379, 4979, 3805.8000000000006, 4504.4, 4979.0, 0.36570679142732837, 26.585668244434004, 0.05499887292950056], "isController": false}, {"data": ["Checkout-0", 100, 0, 0.0, 2563.799999999999, 268, 4623, 4187.3, 4524.749999999998, 4622.41, 0.5059038984954418, 2.8901785793333197, 0.22627342335050035], "isController": false}, {"data": ["Product - Rose Coloured Glasses", 100, 0, 0.0, 2304.36, 319, 5181, 4230.3, 4347.0, 5175.7199999999975, 0.603074473666753, 44.81992361119487, 0.0930525066790498], "isController": false}, {"data": ["Checkout Login-0", 51, 0, 0.0, 2201.3921568627443, 176, 4688, 3841.2000000000003, 4227.599999999999, 4688.0, 0.28921729859701256, 1.6149239581797459, 0.06580823298154681], "isController": false}, {"data": ["Checkout Login-1", 51, 0, 0.0, 2273.039215686275, 218, 5021, 4101.800000000001, 4653.8, 5021.0, 0.2917069431972225, 18.54799026070593, 0.06808394475013299], "isController": false}, {"data": ["Checkout", 100, 0, 0.0, 8043.829999999999, 865, 13650, 12221.300000000001, 12688.3, 13647.759999999998, 0.5043830890437905, 37.78344063820853, 0.4580822976667238], "isController": false}, {"data": ["Product - Grey Tee-0", 58, 0, 0.0, 1794.0862068965514, 379, 4979, 3805.8000000000006, 4504.4, 4979.0, 0.36570679142732837, 26.585668244434004, 0.05499887292950056], "isController": false}, {"data": ["Product - Rose Coloured Glasses-0", 100, 0, 0.0, 2304.36, 319, 5181, 4230.3, 4347.0, 5175.7199999999975, 0.603074473666753, 44.81992361119487, 0.0930525066790498], "isController": false}, {"data": ["Category - Urban Living", 39, 0, 0.0, 1159.564102564102, 119, 4007, 3007.0, 3609.0, 4007.0, 0.23005863545734476, 20.79967174245821, 0.035272661881643685], "isController": false}, {"data": ["Homepage-0", 100, 0, 0.0, 1824.6699999999996, 470, 5292, 3793.0000000000005, 4570.349999999997, 5289.939999999999, 0.6758400692060231, 55.17541824996283, 0.0858000087859209], "isController": false}, {"data": ["Cart", 100, 0, 0.0, 3120.0300000000007, 441, 5166, 4561.8, 4857.599999999999, 5164.3099999999995, 0.5377963257755023, 34.477891361108725, 0.11816813798778128], "isController": false}, {"data": ["Category - Men", 59, 0, 0.0, 1021.5762711864404, 109, 4116, 2740.0, 3494.0, 4116.0, 0.33510541621228646, 26.530951857350168, 0.048433204686932026], "isController": false}, {"data": ["Homepage", 100, 0, 0.0, 1824.6699999999996, 470, 5292, 3793.0000000000005, 4570.349999999997, 5289.939999999999, 0.6758400692060231, 55.17541824996283, 0.0858000087859209], "isController": false}, {"data": ["Add to Cart", 100, 0, 0.0, 5773.7300000000005, 967, 10098, 8879.6, 9849.099999999993, 10097.279999999999, 0.5652304161791554, 58.221531419392484, 0.3698284949609708], "isController": false}, {"data": ["Product - Makeup Brushes-0", 50, 0, 0.0, 1758.7000000000003, 307, 5007, 4052.8999999999996, 4860.5, 5007.0, 0.33326445867853977, 23.167327970969332, 0.050119850230952265], "isController": false}, {"data": ["Checkout Login", 100, 49, 49.0, 2282.06, 0, 8820, 6741.200000000001, 8073.749999999998, 8818.88, 0.4693381393558803, 16.837427831927666, 0.11033112979076906], "isController": false}, {"data": ["Category - Women-0", 43, 0, 0.0, 1103.1627906976744, 128, 4576, 3570.2000000000007, 4283.799999999999, 4576.0, 0.2620241671592315, 20.342053888621447, 0.03838244636121555], "isController": false}, {"data": ["Product - Audio Film-0", 51, 0, 0.0, 1213.7058823529412, 129, 3632, 2562.600000000001, 3243.7999999999997, 3632.0, 0.317099102796068, 23.46150830753017, 0.0479983993490142], "isController": false}, {"data": ["Checkout Order Information", 100, 49, 49.0, 2304.6900000000005, 284, 5046, 4248.8, 4534.349999999999, 5044.209999999999, 0.4693535593427173, 32.97906826131494, 0.10662667823232062], "isController": false}, {"data": ["Checkout Order Information-0", 51, 0, 0.0, 2073.941176470589, 284, 4700, 3709.4000000000015, 4370.0, 4700.0, 0.3097272578206133, 19.693776152215765, 0.0722898580264908], "isController": false}, {"data": ["Add to Cart-1", 100, 0, 0.0, 3111.7599999999993, 532, 5640, 4817.400000000001, 5131.299999999999, 5639.67, 0.5685274570335375, 55.14596409464845, 0.13824544609506917], "isController": false}, {"data": ["Category - Men-0", 59, 0, 0.0, 1021.5762711864404, 109, 4116, 2740.0, 3494.0, 4116.0, 0.33510541621228646, 26.530951857350168, 0.048433204686932026], "isController": false}, {"data": ["Product - Audio Film", 51, 0, 0.0, 1213.7058823529412, 129, 3632, 2562.600000000001, 3243.7999999999997, 3632.0, 0.317099102796068, 23.46150830753017, 0.0479983993490142], "isController": false}, {"data": ["Add to Cart-0", 100, 0, 0.0, 2661.64, 418, 5726, 4132.0, 4685.5, 5718.279999999996, 0.5747357652319346, 3.4524725402027667, 0.236292731604145], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/278\/login?form_build_id=form-MiIY8wEw5ENI9nZx9p3Rdq9uZE9XxrnFuq6rzr9RadE&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/243\/login?form_build_id=form-5G0rBaB25nvn9gkgF67QbzsW69ek3luPMqhPFbf3NY0&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/228\/login?form_build_id=form-z-hcoTmdoBs34DdnTuDxaHEHXkjHargylWCllp5jSHU&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/240\/login?form_build_id=form-dTFrj26AFTHBMN4-J5R-G6YbhPTRLtGJ_xjg-iqI00o&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/265\/login?form_build_id=form-wFa445IwnXVdgjzWbJVrybOp-m3d93jcROapgeKfauA&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/283\/login?form_build_id=form-KCg6btHv4iliJbagZzstOfJFgf_CaDk8Up17MOS1ys0&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/233\/login?form_build_id=form-HHrx1rEmnGJ2Y4J53j7osSAxKXi6WOydSo30ZVf3PY8&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/221\/login?form_build_id=form-xMDncKvjYhYCZ-dAKIxW4pHmhSTqUIXBUnsL9X4GJnQ&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/270\/login?form_build_id=form-3W8XeF60ZMcM3jNFvXevlQFx-wp4n8lL8XigzGen7N0&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/238\/login?form_build_id=form-IVOPBOj4QQ-EP9doZmGoq_BylOJXnjq4lsO4UHtJmlA&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/192\/login?form_build_id=form-wuiuKoobIdn3w_p3nQtu_MlG2-myob0W7WA4kgIxBeA&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/282\/login?form_build_id=form-1x2dW59F6yidb7kdm7-BF364CpETQ-DI2LdF_h-jXlE&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/210\/login?form_build_id=form-ZVVSNwxTypZdOzH9rswtGbtl4iQRZZwpW_P6C2RhBjk&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/218\/login?form_build_id=form-en0rTbmXbZvJdPabjPrSuaKEGf-x-Dr1mcx-OAZUnjs&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/263\/login?form_build_id=form-Nh6-VY79ziMTP-NjXxnx3TXppATsan2XuBAv2eGWOdk&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/272\/login?form_build_id=form-vR2fk5Pdi8Gg_0qhhE7O1P44d09j7AvV2l3R_Bpurhk&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/231\/login?form_build_id=form-YISDMDTAiyJ7L3JTgAa4wIk5-wpfDzkJ8ctWnXU7uXw&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/274\/login?form_build_id=form-HsgZ8GEI-WLUDuE2E82yLLNrlt5dW3bzChzGFnJ223s&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/191\/login?form_build_id=form-v48i6XDekLTJl-7HgEL0gXR_jYeiM1cJyIjLwsimkDo&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/193\/login?form_build_id=form-czBDH0EkPfPcudylZnLNw-rt4h5Qtt2Sp592Q4qvGjA&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/273\/login?form_build_id=form-vo3E6XCzfVb1XAws0K1hMrQAK_dgouoOyV1lt2apU5I&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/256\/login?form_build_id=form-JYxieeJf9n_9SQMWJvPbsCU_tuwFacMDUhGO2vXXIso&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/223\/login?form_build_id=form-TyBaLcLdH10mpOCmywG2NeozTxH4QVLBGy_QyJRrbQc&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/220\/login?form_build_id=form-0sj3V6F14sTj_mp-LJTIB_BxxZ3-ewHUjJvLsmz-mhc&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/258\/login?form_build_id=form-xPPx1RG8qFviPqSaZ4BudVjJ2K-K8bOXqoSuzN3kafg&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/215\/login?form_build_id=form-83pk_DEibLkHOUzFo2-zNHk-d3GX-yd__2N9DM-6GX8&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/197\/login?form_build_id=form-EH25AJbuL9kF3io8v5Uejp1gKYUvDa4JKbQ7YqzKq4w&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["404/Not Found", 49, 50.0, 2.174877940523746], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/247\/login?form_build_id=form-WrmizulSfqcLde47oHV0_8dxkAwLNoLDaZwfGcDcNeg&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/196\/login?form_build_id=form-RSg9pB0EU9_8-vDNGOetP4gOZGC0eDEDKHUqRTeOdno&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/186\/login?form_build_id=form-wWsm1UdpGUHPbt1WiSOERspodJ9dvEwgcsdqzbSy4eE&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/189\/login?form_build_id=form-Y_i3YuGm5sYWgAWIdCjlQ-f8wBZB9ETPyyJoZtNRGHY&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/187\/login?form_build_id=form-cSDYd0oar6Oxg_hpd_ybw05VzmW-LrM1IZeSM0qBr90&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/190\/login?form_build_id=form-ONh4HtZelUQxkoLSrV0O8FWjZGDsdst-iNRCevAMLGo&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/185\/login?form_build_id=form--ZvRrncFLVxMOAfchyBEo8gE3FN5I0gR1zuCZPwqo18&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/242\/login?form_build_id=form-64V93eGb9eq8yIJ96Ns1m712mxm2AACZwXxoam_qHKY&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/208\/login?form_build_id=form--bzn2lAsz9g8mskETFLUdJKaKX58VCIFm3dDWLyqj4Q&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/248\/login?form_build_id=form-uN2Lo54-hjomQklZzsPt3i355OuE_nNarGsQLAKdg00&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/216\/login?form_build_id=form-y4BuO1s7WDdZlQHoTcELlBt37DVGO5EIlGMcq3RUi-o&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/236\/login?form_build_id=form-JMWruaJr391nKobMv664Ku6hwmodr1BCUogvrd1IlyQ&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/271\/login?form_build_id=form-YHISpfvm_jrv_h8m7DnMh7t3fBzaPGxCS5N7IHH0944&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/255\/login?form_build_id=form-XOFTqQde_4XHEKx9wGuixXHIcXLW7300GUtqNNQRI34&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/222\/login?form_build_id=form-W9uflMeVWYCY6AYsPF8_fAfWM4gPsIqlHSB85V9mCt8&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/266\/login?form_build_id=form-GVNZYiQniWqcqwZzJycGKcecBP8co_B2cduWxdPHres&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/202\/login?form_build_id=form-RAeoXLbiLa2b-6MuHuk3UYw4DnRQpE3MD5kKAjKLfJQ&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/250\/login?form_build_id=form-lcF60r0i56fnaUEyqS4ihkgtBYl_LU-i8Pl9NjbP1Cs&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/235\/login?form_build_id=form-tHLqXXK5DZqA4xSqcE9Y2xrO0fJkyYsGRjVR9x0GvMU&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/249\/login?form_build_id=form-npkoKjtESjoJZAFVqoidiDBCyrFTVoB0gzTLuatEAKw&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/252\/login?form_build_id=form-3HJ7nmqD2U8VjtsdcUEAvI6Amsope6xwtzDotU8Cy2c&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/281\/login?form_build_id=form-MgbHxW9GCl617kCsPefDUrA_PhNSvsOzOTHJ0Q086ds&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, 1.0204081632653061, 0.04438526409232135], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2253, 98, "404/Not Found", 49, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/278\/login?form_build_id=form-MiIY8wEw5ENI9nZx9p3Rdq9uZE9XxrnFuq6rzr9RadE&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/243\/login?form_build_id=form-5G0rBaB25nvn9gkgF67QbzsW69ek3luPMqhPFbf3NY0&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/228\/login?form_build_id=form-z-hcoTmdoBs34DdnTuDxaHEHXkjHargylWCllp5jSHU&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/240\/login?form_build_id=form-dTFrj26AFTHBMN4-J5R-G6YbhPTRLtGJ_xjg-iqI00o&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Checkout Login", 100, 49, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/278\/login?form_build_id=form-MiIY8wEw5ENI9nZx9p3Rdq9uZE9XxrnFuq6rzr9RadE&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/243\/login?form_build_id=form-5G0rBaB25nvn9gkgF67QbzsW69ek3luPMqhPFbf3NY0&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/228\/login?form_build_id=form-z-hcoTmdoBs34DdnTuDxaHEHXkjHargylWCllp5jSHU&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/240\/login?form_build_id=form-dTFrj26AFTHBMN4-J5R-G6YbhPTRLtGJ_xjg-iqI00o&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 177: https:\/\/commerceplus.acromedia.com\/checkout\/265\/login?form_build_id=form-wFa445IwnXVdgjzWbJVrybOp-m3d93jcROapgeKfauA&amp;form_id=commerce_checkout_flow_multistep_default&amp;op=Continue as Guest", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Checkout Order Information", 100, 49, "404/Not Found", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
