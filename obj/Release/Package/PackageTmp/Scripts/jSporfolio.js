//problem 1: Math program
function mathProgram() {
    {
        var arrNew = document.getElementById("input").value;
        var arrSpl = arrNew.split(",");
        var arrMax = Math.max.apply(null, arrSpl);
        var arrMin = Math.min.apply(null, arrSpl);
        var arrSum = 0;
        var arrProd = 1;
        for (var i = 0; i < arrSpl.length; i++) {
            arrSum += Number(arrSpl[i]);
        }
        for (var i = 0; i < arrSpl.length; i++) {
            arrProd *= Number(arrSpl[i]);

        }
        document.getElementById("showMean").innerHTML = arrSum / arrSpl.length;
        document.getElementById("showSum").innerHTML = arrSum;
        document.getElementById("showProd").innerHTML = arrProd;
        document.getElementById("showMax").innerHTML = arrMax;
        document.getElementById("showMin").innerHTML = arrMin;
    }
}

//problem 2: Factorial
function factR() {

    var inputFact = Number(document.getElementById("input2").value);
    var findFact = 1;
    for (i = 1; i <= inputFact; i++) {
        findFact = findFact * i;
    }
    document.getElementById("showFactr").innerHTML = findFact;
    document.getElementById("myDigit").innerHTML = inputFact;
}
  
//problem 3: FizzBuzz
function fizzbFunction() {
    var firstInt = document.getElementById("fb1").value;
    var secondInt = document.getElementById("fb2").value;
    var fbResult = " ";
    for (var i = 1; i <= 100; i++) {

        if ((i % firstInt == 0) && (i % secondInt == 0)) {
            fbResult += " fizzbuzz ";
        }
        else if (i % secondInt == 0) {
            fbResult += " Buzz ";
        }
        else if (i % firstInt == 0) {
            fbResult += " Fizz ";
        }
        else {
            fbResult += i + " ";
        }
    }
    document.getElementById("showFB").innerHTML = fbResult;

}

//problem 4: Palindrome

function getPal() {
    var possiblePal = document.getElementById("inputPal").value;
    var splitPal = possiblePal.split("");
    var reversePal = splitPal.reverse().join("");
    if (possiblePal == reversePal) {
        document.getElementById("showPal").innerHTML = "Yup."
    }
    else {
        document.getElementById("showPal").innerHTML = "Nope."
    }
}


//clear 
function Clear() {
    //palindrome
    $("#inputPal").val("");
    $("#showPal").html("");
    //factorial
    $("#input2").val("");
    $("#showFactr").html("");
    $("#myDigit").html("");
    //math program
    $("#input").val("");
    $("#showMean").html("");
    $("#showSum").html("");
    $("#showProd").html("");
    $("#showMax").html("");
    $("#showMin").html("");
    //fizzbuzz
    $("#fb1").val("");
    $("#fb2").val("");
    $("#showFB").html("");
}



$('#modalPal').on('hidden.bs.modal', function () {
    Clear();
})
//factorial
$('#modalFact').on('hidden.bs.modal', function () {
    Clear();
})
// fizzbuzz
$('#modalFB').on('hidden.bs.modal', function () {
    Clear();
})
$('#myModal').on('hidden.bs.modal', function () {
    Clear();
})

