

$('.start-category').show();
$('.pick-category').hide();
$('.pick-difficulty').hide();
$('.pick-type').hide();
$('.questions-container').hide();
$('.results-container').hide();
$('.about').hide()

$('.nav-start').click(function() {
  $('.start-category').show();
  $('.pick-category').hide();
  $('.pick-difficulty').hide();
  $('.pick-type').hide();
  $('.questions-container').hide();
  $('.results-container').hide();
  $('.about').hide()
})

$('.nav-about').click(function() {
  $('.start-category').hide();
  $('.pick-category').hide();
  $('.pick-difficulty').hide();
  $('.pick-type').hide();
  $('.questions-container').hide();
  $('.results-container').hide();
  $('.about').show()
})

/**
 * función de EMPEZAR JUEGO
 */
  $('.start').click(function(event){
    event.stopImmediatePropagation();
    //escondiendo y mostrando secciones
    $('.start-category').hide();
    $('.pick-category').show();
    $('.pick-difficulty').hide();
    $('.pick-type').hide();
    $('.questions-container').hide();
    $('.results-container').hide();
    $('#categories').empty();


    let gameInfo;
    var url = 'amount=05';
    /**
     * llamando la lista de categorías
     */
    fetch(`https://opentdb.com/api_category.php`)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        let categories = data.trivia_categories;
        // enlistando categorías en el html
        $('#categories').append(`<li class="all">All</li>`);
        categories.forEach(function(element){
          $('#categories').append(`<li id="${element.id}">${element.name}</li>`)
        })
      })
      // DEFINIENDO LA URL PARA HACER LA LLAMADA PARA LA PARTIDA ACTUAL A GUSTO DEL JUGADOR
    /**
     * click a una categoría
     */
    $('#categories').on('click', 'li', function(event){
      event.stopImmediatePropagation();
      url = 'amount=05';
      if($(this).hasClass('all')) {
        url = url;
      } else {
        url = `${url}&category=${$(this).attr('id')}`;
      }
      $('.start-category').hide();
      $('.pick-category').hide();
      $('.pick-difficulty').show();
      $('.pick-type').hide();
      $('.questions-container').hide();
      $('.results-container').hide();
    })
    /**
     * click a una dificultad
     */
    $('#difficulty li').click(function(event){
      event.stopImmediatePropagation();
      //event.stopPropagation();
      if($(this).hasClass('all')) {
        url = url;
      } else {
        url = `${url}&difficulty=${$(this).attr('id')}`;
      }
      
      $('.start-category').hide();
      $('.pick-category').hide();
      $('.pick-difficulty').hide();
      $('.pick-type').show();
      $('.questions-container').hide();
      $('.results-container').hide();
    });
    /**
     * click a un tipo de juego
     */
    $('#type li').click(function(event){
      event.stopImmediatePropagation();
      if($(this).hasClass('all')) {
        //url = url;
      } else {
        url = `${url}&type=${$(this).attr('id')}`;
      }
      $('#btn-container button').attr('id', '0');
      // llamando las preguntas de la partida -API- y un index 0 para insertar al DOM la primera
      settingsDone(url);
      $('.start-category').hide();
      $('.pick-category').hide();
      $('.pick-difficulty').hide();
      $('.pick-type').hide();
      $('.questions-container').show();
      $('.results-container').hide();
    })
  }) // fin función START

  /**
   * función llamada API a preguntas
   */
  const settingsDone = function(url) {
    fetch(`https://opentdb.com/api.php?${url}`)
    .then(function(response){
      return response.json();
    }).then(function(data){
      var correct = 0;
      var wrong = 0;
      //return data;
      let questions = data.results;
      gameInfo = questions;
      questionToDOM(questions[0]);
      /**
       * evento click a NEXT pregunta
       */
      $('#btn-container button').click(function(event) {
        event.stopImmediatePropagation();
        let actualID = $(this).attr('id');
        if (actualID > 4) {
          //mostrar resultados *******
          $('#answers-container').empty();
          $('#question').empty();
          $('.questions-container').hide();
          $('.start-category').hide();
          $('.pick-category').hide();
          $('.pick-difficulty').hide();
          $('.pick-type').hide();
          $('.results-container').show();

          $('#results').html(`You got ${correct}/${correct + wrong}</li>`)
          correct = 0;
          wrong = 0;
        } else {
          questionToDOM(gameInfo[actualID]);
        }
      })
      /**
       * evento click a la respuesta
       */
      $('#answers-container').on('click', '.clickeable', function(event) {
        event.stopImmediatePropagation();
        let content = $(this).html();
        if (content.indexOf('\'') !== -1) {
          let index = content.indexOf('\'');
          content[index] = '&‌#039';
        }
        let questionID = $('#question').attr('class');
        let correctAnswer;
        correctAnswer = gameInfo[questionID].correct_answer;
        // si la respuesta es correcta
        if (content === correctAnswer) {
          $(this).addClass('correct');
          correct = correct + 1;
        // si la respuesta es incorrecta
        } else {
          $(this).addClass('wrong');
          let list = $('#answers-container li');
          for (let i = 0; i < list.length; i++) {
            if ($(list[i]).html() == correctAnswer) {
              $(list[i]).addClass('correct');
            }
          }
          wrong = wrong + 1;
        }
        $('#answers-container li').removeClass('clickeable');
        $('#btn-container button').removeAttr('disabled');
      })
    })
  }

  /**
  * insertando en DOM una pregunta
  */
  const questionToDOM = function(questionElement) {
    $('#btn-container button').attr('disabled', 'disabled');
    let id = $('#btn-container button').attr('id');
    $('#question').removeAttr('class');
    $('#question').addClass(id);
    id = parseInt(id) + 1;
    $('#btn-container button').attr('id', id);
    $('#answers-container').empty();
    let category = questionElement.category;
    let difficulty = questionElement.difficulty;
    if (difficulty == 'easy') {
      difficulty = '<i class="fas fa-thermometer-empty fa-2x easy"></i>';
    }
    if (difficulty == 'medium') {
      difficulty = '<i class="fas fa-thermometer-half fa-2x medium"></i>';
    }
    if(difficulty == 'hard') {
      difficulty = '<i class="fas fa-thermometer-full fa-2x hard"></i>';
    }
    let type = questionElement.type;
    let question = questionElement.question;
    let answers = questionElement.incorrect_answers;
    answers.push(questionElement.correct_answer);
    answers.sort(function() {return Math.random() - 0.5});
    if (type === 'multiple') {
      $('#question').html(question);
      $('#category').html(category);
      $('#dificultad').html(difficulty);
      //$('#answers-container').append('')
      answers.forEach(function(element) {
        $('#answers-container').append(`<li class="clickeable">${element}</li>`);
      })
    } else {
      $('#question').html(question);
      answers.forEach(function(element) {
        $('#answers-container').append(`<li class="clickeable">${element}</li>`);
      })
    }
  }

