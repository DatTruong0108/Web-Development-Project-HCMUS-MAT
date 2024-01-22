const fs = require("fs");
const dataFilePath = "./src_auth/data.json";

module.exports={
    getAll:()=> {
        try {
            if (fs.existsSync(dataFilePath)) {
              const dataContent = fs.readFileSync(dataFilePath, 'utf-8');
              const data = dataContent.trim() === '' ? {} : JSON.parse(dataContent);
              return data;
            } else {
              console.error('File not found:', dataFilePath);
              return null;
            }
          } catch (error) {
            console.error('Error reading data.json:', error.message);
            return null;
          }
    },

    update: (dataJson)=>{
        try {
        fs.writeFileSync(dataFilePath, JSON.stringify(dataJson, null, 2));
      //   const updatedData = fs.readFileSync(dataFilePath, 'utf-8');
      //   const parsedData = updatedData.trim() === '' ? {} : JSON.parse(updatedData);
      //   return parsedData;
        } catch (err) {
          console.error('Error writing to data.json:', err);
          return false;
        }
    }
}
