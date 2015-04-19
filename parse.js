var fs = require('fs')

var jsonfile = require('jsonfile')


var definitionsFile = './definitions.json'
var resultFile = './parsed.json'


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

		var objectKey = object[key]

		delete object[key]

		result[ objectKey ] = object

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

	jsonfile.writeFile(
		resultFile,
		mergeObjects(
			flattenObjects( definitions.DestinyClassDefinition, hashKeys.DestinyClassDefinition ),
			flattenObjects( definitions.DestinyRaceDefinition, hashKeys.DestinyRaceDefinition )
		)
	)

} )
