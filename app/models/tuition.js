exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER", 
		    "name": "TEXT", 
		    "address": "TEXT",
		    "state": "TEXT",
		    "postcode": "TEXT",
		    "longitude": "TEXT",
		    "latitude": "TEXT",
		    "contact_person": "INTEGER",
		    "contact_mobile" : "TEXT",
		    "fax_no": "TEXT", 
		    "email": "TEXT",
		    'website': "TEXT",
		    "img_path" : "TEXT", 
		    'status': "INTEGER",
		},
		adapter: {
			type: "sql",
			collection_name: "tuition",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			getMerchantsById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
						id: res.fieldByName('id'),
					    name: res.fieldByName('name'),
					    address: res.fieldByName('address'),
					    state: res.fieldByName('state'),
					    postcode: res.fieldByName('postcode'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    contact_person: res.fieldByName('contact_person'),
					    contact_mobile: res.fieldByName('contact_mobile'),
					    fax_no: res.fieldByName('fax_no'),
					    email: res.fieldByName('email'),
					    website: res.fieldByName('website'),
					    img_path: resfieldByName('img_path'),
					    school_type: res.fieldByName('school_type'),
					    status: res.fieldByName('status'),
					};
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            
            saveArray : function(arr){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
                arr.forEach(function(entry) {
	                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, name, address,state,postcode,contact_person,contact_mobile,fax_no,email,longitude,latitude,website,img_path,school_type,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.name,  entry.address,entry.state ,entry.postcode,entry.contact_person,entry.contact_mobile,entry.fax_no,entry.email,entry.longitude,entry.latitude,entry.website,entry.img_path,entry.school_type,entry.status);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET name=?,address=?,state=?,postcode=?,contact_person=?,contact_mobile=?,fax_no=?,email=?,longitude=?,latitude=?,website=?,img_path=?,school_type=?,status=? WHERE id=?";
					db.execute(sql_query, entry.name,entry.address,entry.state,entry.postcode,entry.contact_person,entry.contact_mobile,entry.fax_no,entry.email,entry.longitude,entry.latitude,entry.website,entry.img_path,entry.school_type,entry.status, entry.id);
				});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		});

		return Collection;
	}
};