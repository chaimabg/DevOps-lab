var mongoose = require("mongoose");
var app=require("./app")
const PORT = process.env.PORT || 5000 ;

mongoose.set("strictQuery", false);
mongoose
    .connect(
        process.env.MONGOOSE_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => app.listen(PORT, console.log(`Sever running on port ${PORT}`)))
    .catch((error) => console.log(error.message));
