  var request = require('request');

  var obj = {
    installer: {
      connectorInstallerFunction: function(options, callback) {
        var myoptions = {
          method: 'post',
          body: {
            type: 'rest',
            name: 'my connection from local testflow using api',
            rest: {
              baseURI: 'http://demo9624631.mockable.io/',
              mediaType: 'json',
              authType: 'basic',
              pingRelativeURI: 'rs1/emp',
              pingMethod: 'GET',
              basicAuth: {
                username: 'abc',
                password: '******'
              }
            }
          },
          json: true,
          url: 'https://api.staging.integrator.io/v1/connections',
          headers: {
            Authorization: 'Bearer ' + options.bearerToken,
          }
        }

        request(myoptions, function(err, res, body) {
          if (err) {
            console.log('Error :', err)
            return
          } else {
            console.log(' Body :', body._id);
            return exportsNew(body._id, callback);
          }
        });

        function exportsNew(id, callback) {
          var exportoptions = {
            method: 'post',
            body: {
              name: 'export from testflow',
              _connectionId: id,
              apiIdentifier: 'e152ce597e',
              asynchronous: true,
              sampleData: {
                department: 'Technology',
                company: 'Celigo Inc.',
                age: '23',
                fname: 'sharat'
              },
              rest: {
                relativeURI: 'rs1/emp',
                method: 'GET'
              }
            },
            json: true,
            url: 'https://api.staging.integrator.io/v1/exports',
            headers: {
              Authorization: 'Bearer ' + options.bearerToken,
            }
          }

          request(exportoptions, function(err, res, body) {
            if (err) {
              console.log('Error :', err)
              return callback('error in export')
            } else {
              console.log(' Body from export:', body._id);
              return importsNew(body._id, id, callback);
            }
          });
        }

        function importsNew(exportid, id, callback) {
          var importoptions = {
            method: 'post',
            body: {
              name: 'import from local',
              sampleData: {
                name: 'abc',
                How_old_are_you: '22',
                Orgnisataion: 'google',
                Title: 'Developer'
              },
              responseTransform: {
                version: '1'
              },
              _connectionId: id,
              distributed: false,
              apiIdentifier: 'i2ec01f3e8',
              mapping: {
                fields: [{
                  extract: 'fname',
                  generate: 'name'
                }, {
                  extract: 'age',
                  generate: 'How_old_are_you'
                }, {
                  extract: '{{department}},{{company}}',
                  generate: 'Title'
                }]
              },
              rest: {
                relativeURI: [
                  'RS2/person'
                ],
                method: [
                  'POST'
                ],
                body: [
                  null
                ],
                responseIdPath: [
                  null
                ],
                successPath: [
                  null
                ]
              }
            },
            json: true,
            url: 'https://api.staging.integrator.io/v1/imports',
            headers: {
              Authorization: 'Bearer ' + options.bearerToken,
            }
          }

          request(importoptions, function(err, res, body) {
            if (err) {
              console.log('Error :', err)
              return callback('error in import')
            } else {
              console.log(' imports Body :', body._id);
              return flowstest(exportid, body._id, callback);
            }
          });
        }

        function flowstest(exportid, importid, callback) {
          var flowoptions = {
            method: 'post',
            body: {
              name: 'My first flow from local',
              disabled: false,
              timezone: 'Asia/Calcutta',
              _exportId: exportid,
              _importId: importid,
              _connectorId: '59faef50a344a836d92814a5',
              _integrationId: '5a000bc232546c5c620ad964',
              skipRetries: false,
            },
            json: true,
            url: 'https://api.staging.integrator.io/v1/flows',
            headers: {
              Authorization: 'Bearer ' + options.bearerToken,
            }
          }

          request(flowoptions, function(err, res, body) {
            if (err) {
              return callback('error in flow')
            } else {
              console.log('flow body id:', body._id);
              updateIntegration(body._id);
            }
          });
        }

        function updateIntegration(id) {
          var updateOptions = {
            method: 'get',
            json: true,
            url: 'https://api.staging.integrator.io/v1/integrations/' +
              options._integrationId,
            headers: {
              Authorization: 'Bearer ' + options.bearerToken,
            }
          }

          request(updateOptions, function(err, res, body) {
            if (err) {
              return callback('error in flow')
            } else {
              console.log('flow body id:', JSON.stringify(body));
              var integrationRec = body
              integrationRec.settings = {
                "sections": [{
                  "title": "test",
                  "flows": [{
                    "_id": id
                  }]
                }]
              }
              integrationRec.mode = "settings"
              var flowoptions = {
                method: 'put',
                body: integrationRec,
                json: true,
                url: 'https://api.staging.integrator.io/v1/integrations/' +
                  options._integrationId,
                headers: {
                  Authorization: 'Bearer ' + options.bearerToken,
                }
              }

              request(flowoptions, function(err, res, body) {
                if (err) {
                  return callback('error in flow')
                } else {
                  console.log('integration body:', body);
                }
              });
            }
          });
        }
      }
    }
  }

  module.exports = obj;
