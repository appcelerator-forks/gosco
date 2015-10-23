exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT", 
		    "k_id": "INTEGER", 
		    "e_id": "INTEGER", 
		    "class_name": "TEXT", 
		    'status': "INTEGER",
		    "created"  : "TEXT",
		    "updated"  : "TEXT"
		},
	  
		adapter: {
			type: "sql",
			collection_name: "kidsEducation",
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
			getKidsSchoolById : function(id){
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
					    k_id: res.fieldByName('k_id'),
					    e_id: res.fieldByName('e_id'), 
					    class_name: res.fieldByName('class_name'),
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
			getSchoolList :  function(){
				var collection = this;
                var sql = "SELECT DISTINCT(e_id) FROM " + collection.config.adapter.collection_name ;
                
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
					    e_id: res.fieldByName('e_id') 
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
            getSchoolByKids :  function(k_id, educationType){
				var collection = this;
                //var sql = "SELECT s.id AS e_id, s.name, s.level,s.school_type,k.id AS ks_id,*,es.className AS cName,es.year FROM " + collection.config.adapter.collection_name + " k, education s, education_class es WHERE k.e_id=s.id AND es.id=k.class_name AND k.k_id='"+ k_id+ "'" ;
                var sql = "SELECT *, k.id AS id, s.name, s.level,s.school_type   FROM " + collection.config.adapter.collection_name +  " k, education s WHERE  k.e_id=s.id AND k_id='"+ k_id+ "' AND s.education_type="+educationType + " GROUP BY k.id ";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
               	var year = new Date().getFullYear(); 
                while (res.isValidRow()){
                	//if(res.fieldByName('year') == year){
						arr[count] = {   
							id: res.fieldByName('id'),
						    k_id: res.fieldByName('k_id'),
						    e_id: res.fieldByName('e_id'),
						  	school_name: res.fieldByName('name'),
						  	school_type: res.fieldByName('school_type'),
						    level: res.fieldByName('level'), 
						    class_name: parseInt(res.fieldByName('class_name')),
						    status: res.fieldByName('status'),
						    created: res.fieldByName('created'), 
						    updated: res.fieldByName('updated') 
						};
						count++;
					//}
					res.next();
					
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
		            var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, k_id, e_id,class_name,status,created,updated) VALUES (?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.k_id,  entry.e_id,entry.ec_id ,entry.status, entry.created,entry.updated);
				 
			 	});
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
			addNewKidsSchool : function(e){ 
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE k_id='"+e.k_id+"' AND e_id='"+e.e_id+"' " ;
 				 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
              
                if (!res.isValidRow()){ 
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (  k_id, e_id, class_name,status,created,updated) VALUES (?,?,? ,?,?,?)"; 
	           		db.execute(sql_query,e.k_id,e.e_id, "",1,e.created, e.updated );
	            } 
	            
	            db.close();
	            collection.trigger('sync');
			},
			 
			updatePartialRecords : function(item){
				var collection = this;
				
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                 
                var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET class_name=?,updated=? WHERE id=?";
			 	db.execute(sql_query,  item.item, currentDateTime(), item.id);
                db.close(); 
	            collection.trigger('sync');
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
			resetData : function(e){
            	var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            }
		});

		return Collection;
	}
};