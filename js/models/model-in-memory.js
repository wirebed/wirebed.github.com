directory.Employee = Backbone.Model.extend({

    initialize:function () {
        this.reports = new directory.ReportsCollection();
        this.reports.parent = this;
    },

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findById(parseInt(this.id), function (data) {
                options.success(data);
            });
        }
    }

});

directory.EmployeeCollection = Backbone.Collection.extend({

    model: directory.Employee,

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findByName(options.data.name, function (data) {
                options.success(data);
            });
        }
    }

});

directory.ReportsCollection = Backbone.Collection.extend({

    model: directory.Employee,

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findByManager(this.parent.id, function (data) {
                options.success(data);
            });
        }
    }

});

directory.MemoryStore = function (successCallback, errorCallback) {

    this.findByName = function (searchKey, callback) {
        var employees = this.employees.filter(function (element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        callLater(callback, employees);
    }

    this.findByManager = function (managerId, callback) {
        var employees = this.employees.filter(function (element) {
            return managerId === element.managerId;
        });
        callLater(callback, employees);
    }

    this.findById = function (id, callback) {
        var employees = this.employees;
        var employee = null;
        var l = employees.length;
        for (var i = 0; i < l; i++) {
            if (employees[i].id === id) {
                employee = employees[i];
                break;
            }
        }
        callLater(callback, employee);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores that use async data access APIs
    var callLater = function (callback, data) {
        if (callback) {
            setTimeout(function () {
                callback(data);
            });
        }
    }

    this.employees = [
        {"id": 1, "firstName": "James", "lastName": "King", "managerId": 0, managerName: "", "title": "President and CEO", "department": "Corporate", "cellPhone": "617-000-0001", "officePhone": "781-000-0001", "email": "jking@fakemail.com", "city": "Boston, MA", "pic": "james_king.jpg", "twitterId": "@fakejking", "blog": "http://coenraets.org","copyright":"gnu", "type":"Communication","url":""},
        {"id": 2, "firstName": "Ingenu", "lastName": "RPMA", "managerId": 0, managerName: "", "title": "Ingenu¡¯s LPWAN Technology - RPMA", "department": "", "cellPhone": "", "officePhone": "", "email": "", "city": "", "pic": "julie_taylor.jpg", "twitterId": "", "blog": "","copyright":"gnu", "type":"Communication","url":"contact us"}        
    ];

    callLater(successCallback);

}

directory.store = new directory.MemoryStore();