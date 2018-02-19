
/**
 * función de EMPEZAR JUEGO
 */
  $('#start').click(function(event){
    event.stopImmediatePropagation();
    let gameInfo;
    var url = 'amount=05';
    /**
     * llamando la lista de categorías
     */
    fetch(`https://opentdb.com/api_category.php`)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        let categories = data.trivia_categories;
        // enlistando categorías en el html
        categories.forEach(function(element){
          //console.log(element);
          $('#categories').append(`<li id="${element.id}">${element.name}</li>`)
        })
      })
      // DEFINIENDO LA URL PARA HACER LA LLAMADA PARA LA PARTIDA ACTUAL A GUSTO DEL JUGADOR
    
    console.log(url);
    /**
     * click a una categoría
     */
    $('#categories').on('click', 'li', function(event){
      event.stopImmediatePropagation();
      url = 'amount=05';
      if($(this).hasClass('all')) {
        //url = url;
      } else {
        url = `${url}&category=${$(this).attr('id')}`;
      }
      console.log(url);

    })
    /**
     * click a una dificultad
     */
    $('#difficulty li').click(function(event){
      event.stopImmediatePropagation();
      //event.stopPropagation();
      if($(this).hasClass('all')) {
        //url = url;
        console.log(url);
      } else {
        url = `${url}&difficulty=${$(this).attr('id')}`;
        console.log(url);
      }
      

    });
    /**
     * click a un tipo de juego
     */
    $('#type li').click(function(event){
      event.stopImmediatePropagation();
      if($(this).hasClass('all')) {
        //url = url;
        console.log(url);
      } else {
        url = `${url}&type=${$(this).attr('id')}`;
        console.log(url);
      }
      $('#btn-container button').attr('id', '0');
      // llamando las preguntas de la partida -API- y un index 0 para insertar al DOM la primera
      settingsDone(url, 0);
    })
  }) // fin función START

  /**
   * función llamada API a preguntas
   */
  const settingsDone = function(url, index) {
    let correct = 0;
    let wrong = 0;

    fetch(`https://opentdb.com/api.php?${url}`)
    .then(function(response){
      return response.json();
    }).then(function(data){
      console.log(data)
      //return data;
      let questions = data.results;
      gameInfo = questions;
      questionToDOM(questions[index]);
      /**
       * evento click a NEXT pregunta
       */
      $('#btn-container button').click(function(event) {
        event.stopImmediatePropagation();
        let actualID = $(this).attr('id');
        console.log(actualID);
        if (actualID > 4) {
          console.log('fin!');
          //mostrar resultados *******
          $('#answers-container').empty();
          $('#answers-container').append(`<li id="results"> You got ${correct}/${correct + wrong}</li>`)
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
        let questionID = $('#question').attr('class');
        let correctAnswer;
        correctAnswer = gameInfo[questionID].correct_answer;
        console.log(questionID)
        console.log(correctAnswer);
        // si la respuesta es correcta
        if (content === correctAnswer) {
          $(this).addClass('correct');
          correct = correct + 1;
        // si la respuesta es incorrecta
        } else {
          console.log('no es correcta!')
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
      })
    })
  }

  /**
  * insertando en DOM una pregunta
  */
  const questionToDOM = function(questionElement) {
    let id = $('#btn-container button').attr('id');
    console.log(id)
    $('#question').removeAttr('class');
    $('#question').addClass(id);
    id = parseInt(id) + 1;
    $('#btn-container button').attr('id', id);
    $('#answers-container').empty();
    let category = questionElement.category;
    let difficulty = questionElement.difficulty;
    let type = questionElement.type;
    let question = questionElement.question;
    let answers = questionElement.incorrect_answers;
    answers.push(questionElement.correct_answer);
    console.log(answers);
    answers.sort(function() {return Math.random() - 0.5});
    console.log(answers);
    if (type === 'multiple') {
      console.log('es multiple')
      $('#question').html(question);
      //$('#answers-container').append('')
      answers.forEach(function(element) {
        console.log(element);
        $('#answers-container').append(`<li class="clickeable">${element}</li>`);
      })
    } else {
      console.log('es true false')
    }
  }

