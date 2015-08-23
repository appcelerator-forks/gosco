exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "b_name": "TEXT", 
		    "b_desc": "TEXT",
		    "b_publisher": "TEXT",
		    "b_link": "TEXT",
		    "b_type": "TEXT", 
		    "b_status": "TEXT", 
		    "b_option": "TEXT", 
		    "b_longitude": "TEXT", 
			"b_latitude": "TEXT", 
			"b_startdate": "TEXT", 
			"b_enddate": "TEXT", 
		    "img_path" : "TEXT", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},
	 
		adapter: {
			type: "sql",
			collection_name: "banner",
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
			getBannerById : function(id){
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
					    b_name: res.fieldByName('b_name'),
					    b_desc: res.fieldByName('b_desc'),
					    b_publisher: res.fieldByName('b_publisher'),
					    b_link: res.fieldByName('b_link'),
					    b_type: res.fieldByName('b_type'),
					    b_status: res.fieldByName('b_status'), 
					    b_option: res.fieldByName('b_option'), 
					    b_longitude: res.fieldByName('b_longitude'), 
					    b_latitude: res.fieldByName('b_latitude'),
					    b_startdate: res.fieldByName('b_startdate'),
					    b_enddate: res.fieldByName('b_enddate'),  
					    img_path: res.fieldByName('img_path'), 
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated')  
					}; 
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            getBannerList :  function(b_type){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE status='1' AND b_type='"+b_type+"' " ;
                
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
					    b_name: res.fieldByName('b_name'),
					    b_desc: res.fieldByName('b_desc'),
					    b_publisher: res.fieldByName('b_publisher'),
					    b_link: res.fieldByName('b_link'),
					    b_type: res.fieldByName('b_type'),
					    b_status: res.fieldByName('b_status'), 
					    b_option: res.fieldByName('b_option'), 
					    b_longitude: res.fieldByName('b_longitude'), 
					    b_latitude: res.fieldByName('b_latitude'),
					    b_startdate: res.fieldByName('b_startdate'),
					    b_enddate: res.fieldByName('b_enddate'),  
					    img_path: res.fieldByName('img_path'), 
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'), 
					    updated: res.fieldByName('updated')  
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
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, b_name, b_desc,b_publisher,b_link,b_type,status,img_path,b_option,b_longitude,b_latitude,b_startdate,b_enddate,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.b_name,  entry.b_desc,entry.b_publisher ,entry.b_link,entry.b_type,entry.b_status,entry.img_path,entry.b_option,entry.b_longitude,entry.b_latitude,entry.b_startdate, entry.b_enddate, entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET b_name=?,b_desc=?,b_publisher=?,b_link=?,b_type=?,status=?,b_option=?,b_longitude=?,b_latitude=?,b_startdate=?,b_enddate=?, img_path=?,updated=? WHERE id=?";
					db.execute(sql_query, entry.b_name,entry.b_desc,entry.b_publisher,entry.b_link,entry.b_type,entry.b_status,entry.b_option,entry.b_longitude,entry.b_latitude,entry.b_startdate,entry.b_enddate, entry.img_path,entry.updated, entry.id);
			 	});
			 	    
			 	
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
		});

		return Collection;
	}
};