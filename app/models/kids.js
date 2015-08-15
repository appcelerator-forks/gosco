exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "fullname": "TEXT", 
		    "u_id": "TEXT",
		    "dob": "TEXT",
		    "gender": "TEXT",
		    "contact": "TEXT", 
		    "hobby": "TEXT", 
		    "img_path" : "TEXT", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},
	  
		adapter: {
			type: "sql",
			collection_name: "kids",
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
			getKidsById : function(id){
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
					    fullname: res.fieldByName('fullname'),
					    u_id: res.fieldByName('u_id'),
					    dob: res.fieldByName('dob'),
					    gender: res.fieldByName('gender'),
					    hobby: res.fieldByName('hobby'),
					    contact: res.fieldByName('contact'), 
					    img_path: res.fieldByName('img_path'), 
					    status: res.fieldByName('status') 
					};
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            getMyKids :  function(u_id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE u_id='"+ u_id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
						id: res.fieldByName('id'),
					    fullname: res.fieldByName('fullname'),
					    u_id: res.fieldByName('u_id'),
					    dob: res.fieldByName('dob'),
					    gender: res.fieldByName('gender'),
					    hobby: res.fieldByName('hobby'),
					    contact: res.fieldByName('contact'), 
					    img_path: res.fieldByName('img_path'), 
					    status: res.fieldByName('status') 
					};
					res.next();
					count++;
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
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, fullname, u_id,dob,gender,hobby,contact,img_path,status,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.fullname,  entry.u_id,entry.dob ,entry.gender,entry.hobby,entry.contact,entry.img_path,entry.status,entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET fullname=?,u_id=?,dob=?,gender=?,hobby=?,contact=?,status=?,img_path=?,updated=? WHERE id=?";
					db.execute(sql_query, entry.fullname,entry.u_id,entry.dob,entry.gender,entry.hobby,entry.contact,entry.status,entry.img_path,entry.updated, entry.id);
			 	});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		});

		return Collection;
	}
};