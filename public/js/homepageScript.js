var checkone = true;
var checktwo;
var val1, val2;
var firstinput = document.getElementsByClassName("firstinput");
var gamemode = document.getElementsByClassName("gamemode");



  for (i = 0; i < firstinput.length; i++) {
    firstinput[i].addEventListener("click", function(e){

      //e.preventDefault();
      if (checkone === true) {
        //console.log(e.currentTarget.value);
      val1 = e.currentTarget.value;
      $('.controls').removeClass('hidden');
      $('.controls').addClass('unhidden');
      e.currentTarget.style.border = '5px solid white';
      checktwo = true;
      checkone = false;
      }
    });
  }

  for (i = 0; i < gamemode.length; i++) {
    gamemode[i].addEventListener("click", function(e){
      //e.preventDefault();
      if (checktwo === true) {
      //console.log(e.currentTarget.value);
      val2 = e.currentTarget.value;
      $('.submit').removeClass('hidden');
      $('.submit').addClass('unhidden');
      e.currentTarget.style.border = '5px solid white';
      checktwo = false;
      }
    });
  }
