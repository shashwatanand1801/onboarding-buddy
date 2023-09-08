const dotenv = require('dotenv')
const MongoClient = require("mongodb");

//Load the env file
dotenv.config();

class Db {
    async getCandidateInfo(req, res) {

        console.log("inside get ")

        const uri = process.env.DB_HOST;
        console.log("DB HOST : ", uri)
        const client = new MongoClient(uri);
        try {
            const database = client.db("test");
            const movies = database.collection("mappings");
            // Create a filter for movies with the title "Random Harvest"
            const filter = { email: "shash@google.com" };
            /* Set the upsert option to insert a document if no documents match
            the filter */
            const options = { upsert: true };
            // Specify the update to set a value for the plot field
            const updateDoc = {
              $set: {
                name: `New name as : ${Math.random()}`
              },
            };
            // Update the first document that matches the filter
            const result = await movies.updateOne(filter, updateDoc, options);
            
            // Print the number of matching and modified documents
            console.log(
              `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
          } finally {
            // Close the connection after the operation completes
            await client.close();
          }
    // try {
    //   let candidateInfo = await mappingModel
    //     .find({});
    //   if (Mapping) {
    //     return res.json({ Mappings });
    //   }
    // } catch (err) {
    //   console.log(err);
    // }

  }

  async addCandidateInfo(req, res) {

    console.log(req)

    let {email} = req.body;

    if (!email) {
      return res.json({ error: "Email not provided" });
    }
    else {
      try {

        const result = await gptController.call(bFile, specification, bisName)

        console.log(result)

        let newMappings = new mappingModel({
          mapping: JSON.parse(result),
          email: email,
          name: bisName
        });
        let save = await newMappings.save();
        if (save) {
          return res.json({ success: "Mappings save in DB successfully" ,
                            mapping: JSON.parse(result)});
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const dbController = new Db();
module.exports = dbController;
