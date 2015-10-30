var fs = require('fs')

var jsonfile = require('jsonfile')


var definitionsFile = 'in/definitions.json'
var assetsFile = 'in/assets.json'


// For jsonfile.writeFile
//var resultFile = './parsed.json'
var definitionsJsFile = 'out/definitions.js'
var assetsJsFile = 'out/assets.js'


// Categories that are not simple lists with hash properties:
// DestinyVendorDefinition
// DestinyHistoricalStatsDefinition
// DestinyGrimoireDefinition

var hashKeys = {

  DestinyActivityDefinition: 'activityHash',
  DestinyActivityTypeDefinition: 'activityTypeHash',
  DestinyClassDefinition: 'classHash',
  DestinyGenderDefinition: 'genderHash',
  DestinyInventoryBucketDefinition: 'bucketHash',
  DestinyInventoryItemDefinition: 'itemHash',
  DestinyProgressionDefinition: 'progressionHash',
  DestinyRaceDefinition: 'raceHash',
  DestinyTalentGridDefinition: 'gridHash',
  DestinyUnlockFlagDefinition: 'flagHash',
  DestinyDirectorBookDefinition: 'bookHash',
  DestinyStatDefinition: 'statHash',
  DestinySandboxPerkDefinition: 'perkHash',
  DestinyDestinationDefinition: 'destinationHash',
  DestinyPlaceDefinition: 'placeHash',
  DestinyActivityBundleDefinition: 'bundleHash',
  DestinyStatGroupDefinition: 'statGroupHash',
  DestinySpecialEventDefinition: 'eventHash',
  DestinyFactionDefinition: 'factionHash',
  DestinyGrimoireCardDefinition: 'cardId'

}



// Turns
// [ { key: 'abc', prop1: '123', ... }, { key: 'def', prop1: '456', ... } ]
// [ { key: 'abc', prop1: '123' }, { key: 'def', prop1: '456' } ]
// into
// { 'abc': { prop1: '123', ... }, 'def': { prop1: '456', ... } }
function flattenObjects( objects, key ) {

	return objects.reduce( function ( result, object ) {

		result[ object[key] ] = object

		return result

	}, {} )

}


// Merges all objects passed as arguments, in order (later arguments overwrite properties)
function mergeObjects() {
	var object = {}

	for (var i = 0; i < arguments.length; ++i) {
		for (var key in arguments[i]) {
			object[key] = arguments[i][key]
		}
	}

	return object;
}



jsonfile.readFile( definitionsFile, function ( error, definitions ) {

	// jsonfile.writeFile(
	// 	resultFile,
	// 	mergeObjects(
	// 		flattenObjects( definitions.DestinyInventoryItemDefinition, hashKeys.DestinyInventoryItemDefinition ),
	// 		flattenObjects( definitions.DestinyClassDefinition, hashKeys.DestinyClassDefinition ),
	// 		flattenObjects( definitions.DestinyGenderDefinition, hashKeys.DestinyGenderDefinition ),
	// 		flattenObjects( definitions.DestinyRaceDefinition, hashKeys.DestinyRaceDefinition ),
			
	// 		flattenObjects( definitions.DestinySandboxPerkDefinition, hashKeys.DestinySandboxPerkDefinition ),
	// 		flattenObjects( definitions.DestinyStatDefinition, hashKeys.DestinyStatDefinition )
	// 	)
	// )

	var object = mergeObjects(
		flattenObjects( definitions.DestinyInventoryItemDefinition, hashKeys.DestinyInventoryItemDefinition ),
		flattenObjects( definitions.DestinyClassDefinition, hashKeys.DestinyClassDefinition ),
		flattenObjects( definitions.DestinyGenderDefinition, hashKeys.DestinyGenderDefinition ),
		flattenObjects( definitions.DestinyRaceDefinition, hashKeys.DestinyRaceDefinition ),
		flattenObjects( definitions.DestinySandboxPerkDefinition, hashKeys.DestinySandboxPerkDefinition ),
		flattenObjects( definitions.DestinyStatDefinition, hashKeys.DestinyStatDefinition )
	)

	fs.writeFile(definitionsJsFile, 'var DEFINITIONS = ' + JSON.stringify(object) + ';\n', function () {
		console.log('Wrote definitions to ' + definitionsJsFile)
	})

} )

jsonfile.readFile( assetsFile, function ( error, assets ) {

	fs.writeFile(assetsJsFile, 'var ASSETS = ' + JSON.stringify(assets) + ';\n', function () {
		console.log('Wrote assets to ' + assetsJsFile)
	})

} )
