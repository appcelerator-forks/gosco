exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY", 
		    "k_id": "TEXT", 
		    "c_id": "INTEGER", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},
	  
		adapter: {
			type: "sql",
			collection_name: "kidsCurriculum",
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
			 
		 
            getCurriculumList :  function(k_id,school_id){
				var collection = this;
                var sql = "SELECT kc.*, c.curriculum, c.img_path FROM " + collection.config.adapter.collection_name + " kc, curriculum c WHERE kc.c_id=c.id AND k_id='"+k_id+"' ORDER BY c.curriculum " ;
 
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
					    c_id: res.fieldByName('c_id'),
					    curriculum: res.fieldByName('curriculum'),
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
			removeById : function(id){
            	var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE id="+id;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            },
            addNewKidsCurriculum : function(e){ 
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE k_id='"+e.k_id+"' AND c_id='"+e.c_id+"' " ;
 	
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
              	 
                if (!res.isValidRow()){ 
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (  k_id, c_id,  status,created,updated) VALUES (?,?,?,?,?)"; 
	           		db.execute(sql_query,e.k_id,e.c_id, 1,e.created, e.updated ); 
	            } 
	            
	            db.close();
	            collection.trigger('sync');
			},
            saveArray : function(arr){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                
        		arr.forEach(function(entry) {
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, k_id, c_id,status,created,updated) VALUES (?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.k_id,  entry.c_id  ,entry.status,entry.created,entry.updated);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET k_id=?,c_id=?,status=?,updated=? WHERE id=?";
					db.execute(sql_query, entry.k_id,entry.c_id ,  entry.status ,entry.updated, entry.id);
			 	});
				 
	            db.close();
	            collection.trigger('sync');
			},
		}); 
		return Collection;
	}
};