const list = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const maptoken=process.env.MAP_TOKEN;
const  geocodingClient= mbxGeocoding({ accessToken: maptoken });


module.exports.index = async (req, res) => {
    try {
        const alllist = await list.find({});
        res.render("list/index.ejs", { alllist }); // Render only the content part
    } catch (error) {
        console.error('Error fetching listings:', error);
        req.flash("error", "Failed to retrieve listings");
        res.redirect("/listings");
    }
};

    
   

   
   module.exports.index2 = async (req, res) => {
    let { id } = req.params;
     
        let lists = await list.findById(id)
            .populate({path:"reviews",populate:{path:"author"}})
            .populate("owner");
        
        if (!lists) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }

        res.render("list/show.ejs", { lists });
    
};

module.exports.index3 = async (req, res) => {

  let response=  await geocodingClient.forwardGeocode({
        query:req.body.lists.location,
        limit:1,
    })
    .send();
   
    // .then(response=>{
    //     const match=response.body;
    // });
      // Check the data structure
      let url= req.file.path
      let filename= req.file.filename
      const newListing =  await new list(req.body.lists);
newListing.owner = req.user._id;
newListing.image = { url, filename };
newListing.geometry = response.body.features[0].geometry; // Ensure this includes both 'type' and 'coordinates'
await newListing.save();



       
        req.flash("success", "New listing created!");
      res.redirect(`/listings`);
    
};



        //Edit route
    module.exports.index4=(async (req,res)=>{
        let { id } = req.params;
  const lists = await list.findById(id);
  
  if (!lists) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalUrl =lists.image.url;
 originalUrl= originalUrl.replace("/upload","/upload/h_100,w_250")
  res.render("list/Edit.ejs", { lists ,originalUrl});
       
    })
    //updae route
    module.exports.index5 = async (req, res) => {
        let { id } = req.params;
        
        try {
            let updatedListing = await list.findByIdAndUpdate(id, { ...req.body.lists }, { new: true, runValidators: true });
             if( typeof req.file !== "undefined"){
            let url= req.file.path
      let filename= req.file.filename 
      updatedListing.image={url,filename}
     
      await updatedListing.save(); // Debugging statement
             }
            req.flash("success", "Listing updated successfully!");
            return res.redirect(`/listings/${id}`);
        } catch (error) {
            console.log('Update Error:', error);  // Debugging statement
            req.flash("error", "Failed to update listing");
            return res.redirect(`/listings/${id}/edit`);
        }
    };
    
    
    
    module.exports.index6=(async (req,res)=>{
        let {id}=req.params;
        let dellist= await list.findByIdAndDelete(id);



        console.log(dellist);
        req.flash("success","listings Deleted!")
        res.redirect("/listings");
    
    });
    //icon category

    module.exports.filterByCategory = async (req, res) => {
        const category = req.query.category;
      
        const validCategories = ['Trending', 'Top cities', 'Design', 'Swimming pools', 'Tree Houses', 'Cabins', 'New'];
      
        if (!validCategories.includes(category)) {
          req.flash('error', 'Invalid category');
          return res.redirect('/listings');
        }
      
        try {
          const filteredLists = await list.find({ category });
          res.json(filteredLists);
          
          
           
        } catch (error) {
          console.error("Error fetching filtered listings:", error);
          req.flash('error', 'An error occurred while fetching listings. Please try again later.');
          res.redirect('/listings');
        }
      };
      
    
     
    
    
    
    



    //search category
    module.exports.searchListings = async (req, res) => {
        const { query } = req.query; // Get the search query from the request
        if (!query) {
            req.flash("error", "Please enter a search term");
            return res.redirect("/listings");
        }
    
        const searchRegex = new RegExp(query, 'i'); // Create a case-insensitive regex for the search query
        const listings = await list.find({
            $or: [
                { location: searchRegex },
                { country: searchRegex }
            ]
        });
    
        if (listings.length === 0) {
            req.flash("error", "No listings found matching your search criteria");
        }
    
        res.render("list/index.ejs", { alllist: listings });
    };
    
 
