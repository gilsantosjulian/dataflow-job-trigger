const google = require('googleapis');

exports.cloudSQLToBigQueryJob = (event, context) => {
  // in this case the PubSub message payload and attributes are not used
  // but can be used to pass parameters needed by the Dataflow template
  const pubsubMessage = event.data;
  console.log(Buffer.from(pubsubMessage, 'base64').toString());
  console.log(event.attributes);

  google.google.auth.getApplicationDefault(function (err, authClient, projectId) {
    if (err) {
      console.error('Error occurred: ' + err.toString());
      throw new Error(err);
    }

    const dataflow = google.google.dataflow({
      version: 'v1b3',
      auth: authClient
    });

    // CloudSQL to BigQuery
    dataflow.projects.templates.create({
      projectId: 'ach-tin-prd',
      resource: {
        parameters: {},
        jobName: 'cloudsql-to-bigquery-prd-job',
        gcsPath: 'gs://cloudsql-to-bigquery-job-prd/templates/cloudSQLToBigQueryJob'
      }
    }, function (err, response) {
      if (err) {
        console.error("Problem running dataflow template, error was: ", err);
      }
      console.log("Dataflow CloudSQL template response: ", response);
    });

    // Datastore to BigQuery
    dataflow.projects.templates.create({
      projectId: 'ach-tin-prd-multireg',
      resource: {
        parameters: {},
        jobName: 'datastore-to-bigquery-prd-job',
        gcsPath: 'gs://datastore-to-bigquery-job-prd-multireg/templates/datastoreToBigQueryJob'
      }
    }, function (err, response) {
      if (err) {
        console.error("Problem running dataflow template, error was: ", err);
      }
      console.log("Dataflow Datastore template response: ", response);
    });

  });
};