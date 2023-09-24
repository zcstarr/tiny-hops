# Tiny-Hops Schema
#### Example
```json
{
 steps : [{
    stepName: "foobar", 
    stepInput: 
      [ {
          cid: "xxxxx"    
       }
       ]
    stepOutput: [ {
        cid:
     }]
  }]

}
```
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "https://tiny-hops-workflow-schema",
  "title": "workflow",
  "$ref": "#/definitions/workflow",
  "definitions": {
    "version": {
      "title": "version",
      "type": "string"
    },
    "workflow": {
      "type": "object",
      "properties": {
        "version": {
          "$ref": "#/definitions/version"
        },
        "steps": {
          "$ref": "#/definitions/steps"
        }
      },
      "required": ["version", "steps"]
    },
    "steps": {
        "type": "array",
        "items": {
            "oneOf": [
                {
                    "$ref": "#/definitions/stepItems"
                },
                {
                    "$ref": "#/definitions/stepItem"
                }
            ]
        }
    },
    "stepItem": {
      "title": "stepItem",
      "type": "object",
      "properties": {
        "stepName": {
          "$ref": "#/definitions/stepName"
        },
        "stepDesc": {
          "$ref": "#/definitions/stepDesc"
        },
        "stepInput": {
          "$ref": "#/definitions/stepInput"
        },
        "stepOutput": {
          "$ref": "#/definitions/stepOutput"
        }
      },
      "required": ["stepName", "stepInput", "stepOutput"]
    },
    "stepItems": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/stepItem"
      }
    },
    "stepDesc": {
      "title": "stepDesc",
      "type": "string"
    },
    "stepName": {
      "title": "stepName",
      "type": "string"
    },
    "ioFormatCid": {
      "type": "object",
      "properties": {
        "cid": {
          "$ref": "#/definitions/cid"
        }
      },
      "additionalProperties": false
    },
    "ioFormatUri": {
      "type": "object",
      "properties": {
        "uri": {
          "type": "string",
          "format": "uri", 
          "pattern": "^^file://||^s3://||^ipfs://"
        }
      },
      "additionalProperties": false
    },
    "ioFormatMetadata": {
      "oneOf": [
        {
          "$ref": "#/definitions/ioFormatCid"
        },
        {
          "$ref": "#/definitions/ioFormatUri"
        }
      ]
    },
    "ioFormat": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ioFormatMetadata"
      }
    },
    "cid": {
      "title": "cid",
      "type": "string"
    },
    "stepInput": {
      "title": "stepInput",
      "type": "array",
      "items": {
        "$ref": "#/definitions/ioFormat"
      }
    }
  },
  "stepOutput": {
    "title": "stepOutput",
    "type": "array",
    "items": {
      "$ref": "#/definitions/ioFormat"
    }
  }
}
```
