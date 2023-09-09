const dotenv = require('dotenv')
const MongoClient = require("mongodb").MongoClient;

//Load the env file
dotenv.config();

class Db {
    async getCandidateInfo(req, res) {        

        let {email} = req.body;

        let skills
        let name

        const uri = process.env.DB_HOST;
        const client = new MongoClient(uri);

        try {
            const database = client.db(process.env.DB_NAME);
            const col = database.collection(process.env.COLLECTION_NAME);
            // Create a filter for movies with the title "Random Harvest"
            const filter = { email: email };
            
            const document = await col.findOne(filter);

            if(JSON.stringify(document) == null){
                return res.json({
                    failure : "NO data for the email in DB"
            })
            }

            skills = document.skills
            name = document.name
          } finally {
            // Close the connection after the operation completes
            await client.close();
          }

    return res.json({
        skills: skills,
        name: name
    })

  }

  async updateCandidateInfo(req, res) {

    let {email, skills} = req.body;

    const uri = process.env.DB_HOST;
    const client = new MongoClient(uri);

        

    if (!email || !skills) {
      return res.json({ error: "Email or skill not provided" });
    }
    else {
        try {
            const database = client.db(process.env.DB_NAME);
            const col = database.collection(process.env.COLLECTION_NAME);
            
            const filter = { email: email };
            /* Set the upsert option to insert a document if no documents match
            the filter */
            const options = { upsert: true };
            // Specify the update to set a value for the skill field
            const updateDoc = {
              $set: {
                skills: skills
              },
            };
            // Update the first document that matches the filter
            const result = await col.updateOne(filter, updateDoc, options);
            
            // Print the number of matching and modified documents
            console.log(
              `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
          } finally {
            // Close the connection after the operation completes
            await client.close();
        }
    }

    return res.json({
        success: "Updated Skills"
    })
  }

  async addCandidateInfo(req, res) {

    let candidateInfo = req.body;

    const uri = process.env.DB_HOST;
    const client = new MongoClient(uri);

    if (!candidateInfo) {
      return res.json({ error: "Candidate Info not provided" });
    }
    else {
        try {
            const database = client.db(process.env.DB_NAME);
            const col = database.collection(process.env.COLLECTION_NAME);
            console.log(candidateInfo)
            
            const result = await col.insertOne(candidateInfo);
            res.status(201).json({
              success: "Stored in db"
            });
            
          } catch (error) {
            console.error('Error adding item:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }finally {
            // Close the connection after the operation completes
            await client.close();
        }
    }
  }
}

const dbController = new Db();
module.exports = dbController;
