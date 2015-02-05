$( document ).ready(function() {


	var arr = [];


	$('.send_req').on('click', function() {

		var reqFormat = $(".opt").find(":selected").text().toLowerCase();
		var domList = $("#myArea").val().split('\n');

		for(var i = 0; i < domList.length; i++){

			if (arr.indexOf(domList[i]) == -1) {

				$.ajax( { 
				  url: 'http://freegeoip.net/' + reqFormat + '/' + domList[i], 
				  type: 'GET',
				  domain: domList[i],
			
				  success: function(location) {
				  	
				  	console.log(location);
				  	console.log("reqFormat " + reqFormat);
				  	arr.push(this.domain);


				  	switch (reqFormat) {
					  case 'json':
					    this.addFromOBJ(location);
					    break;
					  case "csv":
					    this.addFromCSV(location);
					    break;
					  case "xml":
					    this.addFromXML(location);
					    break;
					
					  default:
					    console.log("Sorry, some error occured.");
					}

				  },
				  addFromCSV: function(str) {
				  	a = str.split(',');

				  	this.addFromOBJ({
				  		ip: a[0].slice(1,-1),
				  		country_name: a[2].slice(1,-1),
				  		region_name: a[4].slice(1,-1)
				  	});
				  	
				  },
				  addFromOBJ: function(loc) {
				  	
				  	$('.table tr:last').after(
				  		'<tr><td>' + this.domain + '</td>' + 
				  		'<td>' + loc.ip + '</td>' +
				  		'<td>' + loc.country_name + '</td>' +
				  		'<td>' + loc.region_name + '</td></tr>'
				  		);

				  },
				  addFromXML: function(xmlRes) {
				  	$xml = $( $.parseXML( xmlRes ) );
					 $xml.find("Response").each(function(){

					    this.addFromOBJ({
					  		ip: $(this).find("Ip").text(),
					  		country_name: $(this).find("CountryName").text(),
					  		region_name: $(this).find("RegionName").text()
				  		});

					 });
				  }

				});

			} 
		}
	});

	$('textarea').keyup(function (e) {
	    var rows = $(this).val().split("\n");
	    $(this).prop('rows', rows.length +1);
	});

});

