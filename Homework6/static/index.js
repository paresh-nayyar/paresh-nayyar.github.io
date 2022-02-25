document.getElementById('searchTicker').addEventListener('submit', ticker_data);
document.getElementById('crossButton').addEventListener('click', reset_ticker);

document.getElementById('tab-1').addEventListener('click', control_display);
document.getElementById('tab-2').addEventListener('click', control_display);
document.getElementById('tab-3').addEventListener('click', control_display);
document.getElementById('tab-4').addEventListener('click', control_display);

window.onload = function() {
  document.getElementById('company').value = '';
  }

function control_display(item){
	
	const selected_tab = item['target']['id'];

	var x = document.getElementsByClassName('content');
	for(var i=0; i<x.length; i++){
		x[i].style.display = 'none';
	}

	if (selected_tab == 'tab-1'){
		document.getElementById('outputCompanyInfo').style.display = "block"; 

	} else if (selected_tab == 'tab-2'){
		document.getElementById('outputStockSummary').style.display = "block"; 

	} else if (selected_tab == 'tab-3'){
		document.getElementById('outputCharts').style.display = "block"; 

	} else if (selected_tab == 'tab-4'){
		document.getElementById('outputLatestNews').style.display = "block"; 

	} else{
		console.log("PLease select an option")
	}

}

function reset_div(){
	document.getElementById('companyLogo').innerHTML = "";
	document.getElementById('companyInfo').innerHTML = "";
	document.getElementById('stockSummary').innerHTML = "";
	document.getElementById('stockRecommendation').innerHTML = "";
	document.getElementById('outputCharts').innerHTML = '';
	document.getElementById('outputLatestNews').innerHTML = "";
	document.getElementById("errorDiv").style.display = "none";
}

function reset_ticker(){
	document.getElementById("searchTicker").reset(); 
	reset_div();
	document.getElementById('main-navbar').style.display = "none"; 
};

let company_ticker;

function ticker_data(e){

	e.preventDefault();

	// ticker-info
	let ticker = document.getElementById('company').value.toUpperCase();
	fetch("https://stocks-search-finhubapi.wl.r.appspot.com/company_info?symbol=" + ticker)
	.then((res) => {
		if (res.status == 200){
			return res.json();
		}
		else{
			throw new Error("No Record found");
		}
	})
	.then((data) => {

		if (Object.keys(data).length > 0){

			document.getElementById('main-navbar').style.display = "flex"; 
			document.getElementById('outputCompanyInfo').style.display = "block"; 
			document.getElementById("tab-1").focus();

			reset_div();

			document.getElementById('outputStockSummary').style.display = "none"; 
			document.getElementById('outputCharts').style.display = "none"; 
			document.getElementById('outputLatestNews').style.display = "none"; 

			company_ticker = data['ticker']

			// ticker-image
			const image = document.createElement('img');
			image.src = data['logo'];
			image.setAttribute("width", "auto");
	  		image.setAttribute("height", "75px");
			image.style.margin = '0 auto';
			image.style.display = 'block';
			image.style.paddingBottom = '20px';

			// ticker-info
			let keys = ['Company Name', 'Stock Ticker Symbol', 'Stock Exchange Code', 'Company IPO Date', 'Category']
			let values = ['name', 'ticker', 'exchange', 'ipo', 'finnhubIndustry']

			let table = document.createElement('table');
			table.style.borderCollapse = 'collapse';
			table.style.margin = "0 auto";

			for (var i=0; i< keys.length; i++){
				row = table.insertRow();
			
				col1 = row.insertCell();
				col2 = row.insertCell();

				col1.appendChild(document.createTextNode(keys[i]));
				col2.appendChild(document.createTextNode(data[values[i]]));

				col1.style.textAlign = "right";
				col1.style.fontWeight = "bold";
				col1.style.paddingRight = '10px';
				col2.style.color = "#303030";
				row.style.borderTop = "1px solid #DCDCDC";
				row.style.borderBottom = "1px solid #DCDCDC";
			}

			document.getElementById("companyLogo").appendChild(image);
			document.getElementById("companyInfo").appendChild(table);
		}
		else {
			throw new Error("error")
		}	
	})
	.catch((err) =>{
		console.log("error-1");
		document.getElementById('main-navbar').style.display = "none"; 
		reset_div();
		document.getElementById("errorDiv").style.display = "block";
	})

	// ticker-quote
	fetch("https://stocks-search-finhubapi.wl.r.appspot.com/stock_quote?symbol=" + ticker)
	.then((res)=> {
		if (res.ok){
			return res.json();
		}
		else{
			throw new Error("No Record Found")
		}
	})
	.then((data) => {
		if (Object.keys(data).length > 0){

			// ticker stock-summary
			let date = new Date(data['quote']['t'] * 1000);
			get_date = date.getDate().toString() + " " + date.toLocaleString('en-us', { month: 'long' }) + ", " + 
					   date.getFullYear().toString();

			let keys = ['Stock Ticker Symbol', 'Trading Day', 'Previous Closing Price', 'Opening Price', 
			            'High Price', 'Low Price', 'Change', 'Change Percent']
			let values = [company_ticker, get_date, 'pc', 'o', 'h', 'l', 'd', 'dp']

			let table = document.createElement('table');
			table.style.borderCollapse = 'collapse';
			table.style.margin = "0 auto";

			for (var i=0; i< keys.length; i++){
				row = table.insertRow();
			
				col1 = row.insertCell();
				col2 = row.insertCell();

				if ((keys[i] == 'Stock Ticker Symbol') || (keys[i] == 'Trading Day')){
					col1.appendChild(document.createTextNode(keys[i]));
					col2.appendChild(document.createTextNode(values[i]));
			
				} else if ((keys[i] == 'Change') || (keys[i] == 'Change Percent')){
					get_value =(data['quote'][values[i]]).toFixed(2);
					col1.appendChild(document.createTextNode(keys[i]));
					col2.appendChild(document.createTextNode(get_value));

					if (get_value > 0){
						var arrow_up = document.createElement("IMG");
	  					arrow_up.setAttribute("src", "..//static//GreenArrowUp.png");
	  					arrow_up.setAttribute("width", "15px");
	  					arrow_up.setAttribute("height", "15px");
	  					arrow_up.style.paddingLeft = "10px"
	  					col2.appendChild(arrow_up);

					} else if (get_value < 0){
						var arrow_down = document.createElement("IMG");
	  					arrow_down.setAttribute("src", "..//static//RedArrowDown.png");
	  					arrow_down.setAttribute("width", "15px");
	  					arrow_down.setAttribute("height", "15px");
	  					arrow_down.style.paddingLeft = "10px"
	  					col2.appendChild(arrow_down);
					} 
				}

				else{
					col1.appendChild(document.createTextNode(keys[i]));
					col2.appendChild(document.createTextNode(data['quote'][values[i]].toFixed(2)));			    		
				}

				col1.style.textAlign = "right";
				col1.style.fontWeight = "bold";
				col1.style.paddingRight = '10px';
				col2.style.color = "#303030";
				row.style.borderTop = "1px solid #DCDCDC";
				row.style.borderBottom = "1px solid #DCDCDC";
			}

			document.getElementById("stockSummary").appendChild(table);
			
			// ticker recommendation

			if (data['rec'][0]) {

				get_rec_data = data['rec'][0];

				let keys_rec = ['strongSell', 'sell', 'hold', 'buy', 'strongBuy'];
				let colors_rec = ['#FF0000', '#cd5c5c', '#669966', '#00CC33', '#00FF33'];

				let table_rec = document.createElement('table');

				table_rec.style.borderCollapse = 'collapse';
				table_rec.style.margin = "0 auto";

				row_rec = table_rec.insertRow();
				col = row_rec.insertCell();
				col.appendChild(document.createTextNode("Strong"));
				col.appendChild(document.createElement("br"));
				col.appendChild(document.createTextNode("Sell"));
				col.style.textAlign = "center";
				col.style.color = "red";
				col.style.paddingRight = "5px";

				for (var i=0; i<keys_rec.length; i++){
					col = row_rec.insertCell();
					col.appendChild(document.createTextNode(get_rec_data[keys_rec[i]]));
					col.style.textAlign = 'center';
					col.style.fontWeight = "bold";
					col.style.color = 'white';
					col.style.fontSize = '20px';
					col.style.padding = '5px 20px 5px 20px';
					col.style.backgroundColor = colors_rec[i];
				}

				col = row_rec.insertCell();
				col.appendChild(document.createTextNode("Strong"));
				col.appendChild(document.createElement("br"))
				col.appendChild(document.createTextNode("Buy"))
				col.style.textAlign = 'center';
				col.style.color = "green";
				col.style.paddingLeft = "5px";

				const para = document.createElement("p");
				para.appendChild(document.createTextNode("Recommendation Trends"));
				para.style.textAlign ="center";
				para.style.fontSize = "18px";

				document.getElementById("stockRecommendation").appendChild(table_rec);
				document.getElementById("stockRecommendation").appendChild(para);
			}
		}
		else{
			throw new Error("error")
		}	
	})
	.catch((err) => {
		console.log("error-2")
	})

	// ticker-chart
	fetch("https://stocks-search-finhubapi.wl.r.appspot.com/charts?symbol=" + ticker)
	.then((res)=> {
		if (res.ok){
			return res.json();
		}
		else{
			throw new Error("No Record Found")
		}
	})
	.then((data) => {

		if (Object.keys(data).length > 0){
			// Create the chart
		    let closing_price = [], 
		       	volume = [],
	          dataLength = data['t'].length;

	      for (i=0; i < dataLength; i++) {
	      	closing_price.push([
	      		data['t'][i] * 1000, // the date
		        data['c'][i] // close
		        ]);

	        volume.push([
	        	data['t'][i] * 1000, // the date
	          data['v'][i] // the volume
	          ]);
				}

				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); 
				var yyyy = today.getFullYear();

				today =  yyyy + '-' + mm + '-' + dd;

	      chart_title = 'Stock Price ' + company_ticker + " " + today;

	      Highcharts.stockChart('outputCharts', {

				 	chart: {
		        			zoomType: 'xy'
		    			},

			    rangeSelector: {
			    	buttons: [{
				                type: 'day',
				                count: 7,
				                text: '7D'
				            },{
				                type: 'day',
				                count: 15,
				                text: '15D'
				            },{
				                type: 'month',
				                count: 1,
				                text: '1m'
				            },{
				                type: 'month',
				                count: 3,
				                text: '3m'
				            },  {
				                type: 'month',
				                count: 6,
				                text: '6m'
				            }],
		            		selected: 0,
		            		inputEnabled: false
		       			},

		      title: {
		            	text: chart_title
		        	},



		      subtitle: {
		      	     		text: '<a href="https://finnhub.io/." target="_blank" style="color:blue; \
		        		              text-decoration: underline">Source: Finnhub</a>'
		        		},	

		      plotOptions: {
		            	column: {
		               		pointWidth: 5,
		               		pointPlacement: "on"
	            	}	
		        	},

		      xAxis: {
	  							type:'datetime',
	  							tickInterval: 1,
								  breaks: [{
								    from: 1246579200000,
								    to: 1246838400000,
								    breakSize: 3600 *48, // 2 days gap
								    repeat: 604800000 // Repeat every week
								  }]
						},

						

		        	yAxis: [
						{ // Primary yAxis
			        		title: {
			            		text: 'Stock Price',
			            		style: {
			                		color: Highcharts.getOptions().colors[1]
			            			},
			        			},

			        		labels: {
			                	style: {
			                	color: Highcharts.getOptions().colors[1]
			            		}
			        		},       		

		        			opposite: false
		    			}, 
		    			{ // Secondary yAxis
				        	title: {
				            	text: 'Volume',
				            	style: {
				                	color: Highcharts.getOptions().colors[1]
				            	}
				        	},
				        	
				        	labels: {
				            	style: {
				                	color: Highcharts.getOptions().colors[1]
				            	}
				        	},
				        
				        	opposite: true
		    			}],

		        	series: [{
		            	data: closing_price,
		            	name: 'Stock Price',
		            	type: 'area',
		            	yaxis :0,
		            	threshold: null, 
		            	tooltip: {
        						valueDecimals: 2
        					},
		            	fillColor: {
                			linearGradient: {
                    	x1: 0,
                    	y1: 0,
                    	x2: 0,
                    	y2: 1
                		},
                		stops: [
                    	[0, Highcharts.getOptions().colors[0]],
                    	[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                		]
            			}
		        		}, {
		        			data: volume,
		        			name: 'Volume',
		            	type: 'column',
		             	yAxis: 1

		        	}]
		    
		    });
	 	}
	 	else{
			throw new Error("error")
		}	
		
	})
	.catch((err) => {
		console.log("error-3")
	})

	// ticker-news
	fetch("https://stocks-search-finhubapi.wl.r.appspot.com/latest_news?symbol=" + ticker)
	.then((res)=> {
		if (res.ok){
			return res.json();
		}
		else{
			throw new Error("No Record Found")
		}
	})
	.then((data) => {

		if (Object.keys(data).length > 0){
		
			let get_data = data['latest_news'];

			let selected_data = [];
			let i = 0;
			while(selected_data.length < 5){
				temp_data = get_data[i];
				let temp_data_subset = (({image, headline, datetime, url }) => ({image, headline, datetime, url }))(temp_data);
				const isEmpty = Object.values(temp_data_subset).some(x => x.length == 0 || x.length == '');
				if (!isEmpty){
					selected_data.push(temp_data_subset);
				}

				i++;
			}

			let main_divBox = document.createElement('div');

			selected_data.forEach( function(data_element, index) {
				let div_box = document.createElement('div')
				div_box.style.backgroundColor = '#F5F5F5';
				div_box.style.height = '100px';
				div_box.style.width = '1200px';

				let date = new Date(data_element['datetime'] * 1000);
				get_date = date.getDate().toString() + " " + date.toLocaleString('en-us', { month: 'long' }) + ", " + date.getFullYear().toString();

				let table_news = document.createElement('table');
				table_news.style.borderCollapse = 'collapse';
				table_news.style.margin = "10px";

				row_news = table_news.insertRow();

				var news_img = document.createElement("img");
		  		news_img.setAttribute("src", data_element['image']);
		  		news_img.setAttribute("width", "100px");
		  		news_img.setAttribute("height", "75px");

				col1 = row_news.insertCell();
				col2 = row_news.insertCell();

				col1.appendChild(news_img);
				col1.style.width = 'auto';
				col1.style.height = '75px';
				col1.style.paddingTop = '10px';

				let news_headline = document.createElement("span");
				news_headline.appendChild(document.createTextNode(data_element['headline']));
				news_headline.style.color = "black";
				news_headline.style.fontFamily = 'sans-serif';
				news_headline.style.fontSize = '14px';
				news_headline.style.fontWeight = 'bold';
				
				let news_date = document.createElement("span")
				news_date.appendChild(document.createTextNode(get_date));
				news_date.style.color = "grey";
				news_date.style.fontFamily = 'sans-serif';
				news_date.style.fontSize = '15px';
				news_date.style.paddingTop = '15px';

				let news_link = document.createElement("a");
				let linkText = document.createTextNode("See Original Post");
		      	news_link.appendChild(linkText);
				news_link.setAttribute('href', data_element['url']);
				news_link.setAttribute('target', '_blank');

				col2.style.paddingLeft = '20px';
				col2.style.width = '900px'
				col2.style.height = '80px';
				col2.style.textAlign = 'left';
				
				col2.appendChild(news_headline);
				col2.appendChild(document.createElement("br"));
				col2.appendChild(news_date);	
				col2.appendChild(document.createElement("br"));
				col2.appendChild(news_link);

				div_box.appendChild(table_news);
				main_divBox.appendChild(div_box);
			});

			document.getElementById("outputLatestNews").appendChild(main_divBox);
		}
		else{
			throw new Error("error")
		}	

		
	})
	.catch((err) =>{
		console.log("error-4")
	})

}


	