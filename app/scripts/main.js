
    /*
    * Theater, création d'un objet pour toute l'application
    * Cet objet comprend les models, les collections, les vues et les templates
    */
    var Theater = {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{}
    }

    /*
    * On affecte les propriétés natives des models Backbone au model qui 
    * servira au film
    */
    Theater.Models.Movie = Backbone.Model.extend({});

    /*
    * On créé une collection de models de type film 
    * @model : paramètre Backbone pour associé un model à une collection
    * @url : paramètre Backbone servant chargé des données depuis le serveur ou un fichier JSON
    */
    Theater.Collections.Movies = Backbone.Collection.extend({
        model: Theater.Models.Movie,
        url: "scripts/data/movies.json",
        initialize: function(){
          console.log("Movies initialize");
        }
    });

    /*
    * Assignation d'un template underscore pour la vue Liste des films
    */    
    Theater.Templates.movies = _.template($("#tmplt-Movies").html())

    /*
    * On créé la vue pour les films
    * la méthode initialize est utilisée pour installer la vue
    * Les méthodes de la vue sont exécutées en dehors de son context
    * il faut s'assurer que le 'this' correspond bien context courant
    * Dans la fonction render(), on fait référence à 'this', si on n'avait pas
    * fait un bindAll , la référence au 'this' serait fausse.
    * 'this.collection' correspond à la collection qui sera envoyée en paramètre lors 
    * l'instanciation de la vue
    * 'this.collection.bind("reset", this.render);' cette procédure identifie tous les changements
    * et execute this.render
    * Dans le code la route, movies.fetch retourne toutes les datas, quand le fetch est terminé, la collection est 
    * mise à jour et le this.render est exécuté
    */
    Theater.Views.Movies = Backbone.View.extend({
        el: $('#mainContainer'),
        template: Theater.Templates.movies,
        initialize: function(){
          _.bindAll(this, "render", "addOne", "addAll");
          this.collection.bind("reset", this.render);
          this.collection.bind("add", this.addOne);
        },
        render: function(){    
          $(this.el).html(this.template());
          this.addAll();
        },
        addAll: function(){
          //console.log("addAll");
          this.collection.each(this.addOne);
        },
        addOne: function(model){
          //console.log("addOne");
          view = new Theater.Views.Movie({ model: model });
          //console.log('view', view);
          //console.log('this.el', this.el);
          $("ul", this.el).append(view.render());
        }
    });

    /*
    * Assignation d'un template underscore pour la vue film
    */
    Theater.Templates.movie = _.template($('#tmplt-Movie').html());

    /*
    * Création de la vue film, utilisée par la vue liste
    */
    Theater.Views.Movie = Backbone.View.extend({
      tagName: "li",
      template: Theater.Templates.movie,
      initialize: function () {
        _.bindAll(this, "render");
      },
      render: function () {
        //console.log($(this.el));
        //console.log(this.template(this.model.toJSON()));
        //return $(this.el).append('Bonjour');
        return $(this.el).append(this.template(this.model.toJSON()));
      }
    });

    /*
    * Création du Router, il sert à lancer l'application selon une url donnée
    * Ici la fonction 'defaultRoute' est appelé au chargement de la page pour l'url racine
    * C'est le router qui va identifier où doit démarrer l'application
    * Un nouvel Objet Films est créé et la fonction fetch() lance une requête pour exécuter le fichier JSON
    * La fonction fetch est asynchrone, un console.log(movies.length); afficherait 0
    * On crée une instance de vue Film et l'on lui passe l'instance de collection
    */
    Theater.Router = Backbone.Router.extend({
        routes: {
          "": "defaultRoute" 
        },
      
        defaultRoute: function () {
            console.log("defaultRoute");
            Theater.movies = new Theater.Collections.Movies();
            new Theater.Views.Movies({ collection: Theater.movies });
            Theater.movies.fetch({reset: true});
        }
    });

    /*
    * Instanciation du Router
    */
    var appRouter = new Theater.Router();
    Backbone.history.start();


    $("#butAddItem").on('click', function () {
        var movie = new Theater.Models.Movie(
            {
                "Id": "nouveau",
                "Name": "Samuel Gomez",
                "AverageRating": 10,
                "ReleaseYear": 2016,
                "Url": "http://www.samuelgomez.fr",
                "Rating": "YOYO"
            }
        )
      
        Theater.movies.add(movie);
        console.log(Theater.movies.length)
    });
