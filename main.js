var rest = require( 'restler' )
var sql = require( 'sql.js' )
var unzip = require( 'unzip' )
var streamifier = require( 'streamifier' )
var toArray = require( 'stream-to-array' )
var jsonfile = require( 'jsonfile' )


var bungieUrl = 'http://www.bungie.net'
var manifestUrl = bungieUrl + '/platform/Destiny/Manifest/'
var manifestLanguage = 'en'  // 'en', 'fr', 'es', 'de', 'it', 'ja', 'pt-br'

var result = {}
var resultFile = './definitions.json'


rest.get( manifestUrl ).on( 'success', function (responseBody) {

/*** Example response body:

{
  "Response": {
    "version": "44675.15.04.03.2157-5",
    "mobileAssetContentPath": "\/common\/destiny_content\/sqlite\/asset\/asset_sql_content_7c23eefeaa0003dbc141793135dae141.content",
    "mobileGearAssetDataBases": [
      {
        "version": 0,
        "path": "\/common\/destiny_content\/sqlite\/asset\/asset_sql_content_7c23eefeaa0003dbc141793135dae141.content"
      },
      {
        "version": 1,
        "path": "\/common\/destiny_content\/sqlite\/asset\/asset_sql_content_e32e259c46d17fca9ca5b956c7a8f2a5.content"
      }
    ],
    "mobileWorldContentPaths": {
      "en": "\/common\/destiny_content\/sqlite\/en\/world_sql_content_b31bdc596e01315d9445c5b189a6c3d6.content",
      "fr": "\/common\/destiny_content\/sqlite\/fr\/world_sql_content_7b0757776be9bab680355cc6518bcbd5.content",
      "es": "\/common\/destiny_content\/sqlite\/es\/world_sql_content_6a949967cd156922eb88d415c4866f26.content",
      "de": "\/common\/destiny_content\/sqlite\/de\/world_sql_content_83234d4bdc06f62ebc61197c25bb6881.content",
      "it": "\/common\/destiny_content\/sqlite\/it\/world_sql_content_ece96578e049e6aed5d1a31044576a00.content",
      "ja": "\/common\/destiny_content\/sqlite\/ja\/world_sql_content_2ad3b06a300a561ce0a51e155d8b0121.content",
      "pt-br": "\/common\/destiny_content\/sqlite\/pt-br\/world_sql_content_ae4d1d496fbd27b867a6bb1569975b25.content"
    }
  },
  "ErrorCode": 1,
  "ThrottleSeconds": 0,
  "ErrorStatus": "Success",
  "Message": "Ok",
  "MessageData": {
    
  }
}

***/


	console.log( 'Got manifest version: ' + responseBody.Response.version )
	result.version = responseBody.Response.version


	var contentUrl = bungieUrl + responseBody.Response.mobileWorldContentPaths[ manifestLanguage ]

	rest.get( contentUrl ).on( 'success', function (_, response) {

		console.log( 'Got definition database' )

		streamifier.createReadStream( response.raw )
			.pipe( unzip.Parse() )
			.on( 'entry', function (entry) {

				toArray( entry, function (_, array) {

					var db = new sql.Database( new Uint8Array( Buffer.concat(array) ) )

					console.log( 'Database loaded' )

					var tables = db.exec( "SELECT name FROM sqlite_master WHERE type='table'" )[0]

					console.log( tables.values.length + ' tables found' )

					tables.values.forEach( function (tableValue, index) {

						var table = tableValue[0]

						result[ table ] = db.exec( "SELECT json FROM " + table )[0].values.map( function (value) {
							return JSON.parse(value[0])
						})

						console.log( '[' + (index + 1) + '] Table "' + table + '" extracted' )

					})

					jsonfile.writeFileSync( resultFile, result )
					console.log( 'Wrote definitions to ' + resultFile )

				})

			})

	})

})
