var xi = [];
var xbri = [];
var fi = [];

var di = [];
var fidi = [];


$("#btn_login").click(function()
{
    Materialize.toast('I am a toast!', 4000);
});

// show start button help
$(window).on("load", function()
{
    $('.tap-target').tapTarget('open');
});


$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    
});



$(document).ready(function() 
{
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".duplicate"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    var x = 1; //initlal text box count
    var to_duplicate =  '';   

    $(document).on('keypress','input[class=\"validate key-vldt\"]',(function(e){ //on keyup
        console.log($(this).attr("class"));

        //Use enter as tab
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if(key == 13) {
            e.preventDefault();
            var inputs = $(this).closest('form').find(':input:visible');
            inputs.eq( inputs.index(this)+ 1 ).focus();
        }

       
        if (!$(this).parent("div").parent("div").next(".row").length) //search if next row not exists so add
        {   x++; //text box increment
            $(wrapper).append('<div class="row"><div class="input-field col s6"><i class="material-icons remove_field prefix text-red">remove_circle_outline</i><input name="xi'+''+'[]" type="text" class="validate key-vldt"><label for="icon_prefix">X'+(x)+'</label></div><div class="input-field col s6"><input name="fi'+''+'[]" type="text" class="validate key-vldt"><label for="icon_telephone">F'+(x)+'</label></div>'); //add input box
            $('#couter_badge').text(x);
        }

       // $(':focus').focus();
    }));
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').parent('div').remove(); x--;
        $('#couter_badge').text(x);
    })
});


//add all input to array
$('#xifi_btn').click(function()
{
    xi = [];
    fi = [];
    xi = $("input[name='xi[]']") .map(function(){return $(this).val();}).get();
    fi = $("input[name='fi[]']") .map(function(){return $(this).val();}).get();
    

    //remove empty xi and fi
    for(var i=0;i<xi.length;i++)
    {
        if(xi[i] =='' && fi[i]=='')
        {
            xi.splice(i, 1);
            fi.splice(i, 1);
        }
    }
    console.log(xi);
    console.log(fi);
    solve(); 
});

function err(msg)
{
    Materialize.toast(msg, 3000, 'rounded');
}



//////////////////////////////////////////////////////////////////////////////////////////////////////
function isNumber(test) //cheak if any input is number (used for xi and fi);
{
    if(isNaN( parseFloat(test)))
    {
        return false;
    }
    return true;
}

function isNoLevelSpace()
{
    for(var i=0; i<xi.length;i++)
    {
        if(!isNumber(xi[i]))
            {
                err("X"+(i+1) +" یک عدد نیست بلکه یک  " +typeof(xi[i])+" میباشد. ");
                return -1;
            }
            else
            {
                //xi[i] = parseFloat(xi[i]).toString();
            }
        if(!isNumber(fi[i]))
            {
                err("F"+(i+1) +" یک عدد نیست بلکه یک  " +typeof(fi[i])+" میباشد. ");
                return -1;
            }
            else
            {
                //fi[i] = parseFloat(fi[i]).toString();
            }
    }
    return true;
}
function isLevelSpace ()
{
    for(var i=0;i<xi.length;i++)
    {
        if(xi[i].trim().split("-").length !=2)
        {
            //err("no levelspace!");
            return false;
        }
        for(var j=0;j<2;j++)
        {
            if(isNumber(xi[i].trim().split("-")[j]) !=true)
            {
                err("داخل X"+(i+1) +" قیمت " + xi[i].trim().split("-")[j]+ " یک عدد نیست ");
                return -1;
            }


        }
        if(parseFloat(xi[i].trim().split("-")[0]) >= parseFloat(xi[i].trim().split("-")[1]))
        {
            err("داخل X"+(i+1) +" طبقه پایینی: " + xi[i].trim().split("-")[0]+ " باید کوچکتر از طبقه بالایی:  "+xi[i].trim().split("-")[1]+" باشد ");
            return -1;
        }

        if(isNumber(fi[i] ) !=true)
        {
            err("F"+(i+1) +" یک عدد نیست بلکه یک  " +typeof(fi[i])+" میباشد. ");
            return -1;
        }
    }
    return true;
}
function isLevelSpaceEqual()
{

    var tmpArr = xi[0].trim().split("-");
    var levelSpace = tmpArr[1] - tmpArr[0];

    for(var i=0; i<xi.length;i++)
    {
        if(xi[i].trim().split("-")[1]- xi[i].trim().split("-")[0] !=levelSpace)
        {

            //err("not equal lvl space at "+ xi[i]);
            return false;
            
        }
    }
    return true;
}
function otherDataValidate()
{
    //alert("hello!");
    if(xi.length <2 || fi.length<2)
    {
        err("تعداد ورودی های شما " + xi.length + " است، لطفا حد اقل دو ورودی وارد کنید. ");
        return false;
    }
    return true;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////
var solutionCounter = 0;
function solve()
{
    solutionCounter=0;
  
    if(otherDataValidate())
    {

        if(isLevelSpace() ==true)
        {
            solveLevelSpace();
            solutionCounter ++;

            if(isLevelSpaceEqual() ==true)
            {
                solveEqualLevelSpace();
                solutionCounter++;
            }
        }
        else if(isNoLevelSpace() !=-1 && isLevelSpace() != -1) //-1 means that dont try other solutions but current
        {
            solveNoLevelSpace();
            solutionCounter ++;
           
        }

        if(solutionCounter>0)
        {
            showResult(); //at lest we shuld be able to solve via noLevelSpace to show the result
        }
    }
}

function solveNoLevelSpace()
{
    //prepareing for making the result table
    var data = [];
    

    //find A in the middle of the xi
    var A = parseFloat(xi[parseInt(xi.length/2)]);
    if(xi.length%2 == 0)
    {
        A = parseFloat(xi[parseInt(xi.length/2) - 1]);
    }

    for(var i=0;i<xi.length;i++)
    {
        xi[i] = parseFloat(xi[i]); // making sure calculating the correct result
        fi[i] = parseFloat(fi[i]);

        di[i] = xi[i] - parseFloat(A); // cant minus none float and float
       
        fidi[i] = fi[i]*di[i];
        var tmp = {"xi": xi[i],"fi": fi[i],"di": di[i],"fi_di": fidi[i]};
        data.push(tmp);   
    }
    console.log(data);

    
   
    resetResultsOutput(1); //remove last result
    resetResultsOutput(2); //remove last result
    resetResultsOutput(3); //remove last result

    $('.resultHeaderDiv1').append("<h3 style='direction:rtl;' class='font-fa blue-text'>به روش تغیر مبدا: </h3>");

    $( ".resultDiv1" ).append("<p style='direction:rtl;' class='font-fa black-text'>قیمت di از فرمول di=Xi-A که A="+A+" میباشد به دست می آید.</p>");
    $( ".resultDiv1" ).append("<p><i class='material-icons' >functions</i> fi = n  = "+sumArr(fi)+"</p>");
    $( ".resultDiv1" ).append("<p><i class='material-icons' >functions</i> fidi =  "+sumArr(fidi)+"</p>");
    $( ".resultDiv1" ).append("<p>avrg = "+(A+(sumArr(fidi)/sumArr(fi)))+"</p>");
     //print table using upd json
    $('.resultTable1').createTable(data,{});

}

function solveLevelSpace()
{
    //prepareing for making the result table
    var data = [];
    
    var A = parseFloat((parseFloat(xi[parseInt(xi.length/2)].trim().split("-")[1]) + parseFloat(xi[parseInt(xi.length/2)].trim().split("-")[0]))/2);
    xbri[parseInt(xi.length/2)]= A;
    if(xi.length%2 == 0)
    {
        A = parseFloat((parseFloat(xi[parseInt(xi.length/2) -1].trim().split("-")[1]) + parseFloat(xi[parseInt(xi.length/2)-1].trim().split("-")[0]))/2);
        xbri[parseInt(xi.length/2) -1]= A;
    }


    for(var i=0;i<xi.length;i++)
    {
        xbri[i] = parseFloat((parseFloat(xi[i].trim().split("-")[1]) + parseFloat(xi[i].trim().split("-")[0]))/2); // making sure calculating the correct result
        fi[i] = parseFloat(fi[i]);

        di[i] = parseFloat(xbri[i]) - parseFloat(A); // cant minus none float and float
        
        fidi[i] = fi[i]*di[i];
        var tmp = {"xi": xi[i],"xbri":xbri[i],"fi": fi[i],"di": di[i],"fi_di": fidi[i]};
        data.push(tmp);   
    }
        //find A in the middle of the xi


    
    resetResultsOutput(1); //remove last result
    resetResultsOutput(2); //remove last result

    $('.resultHeaderDiv2').append("<h3 style='direction:rtl;' class='font-fa blue-text'>به روش تغیر مبدا: </h3>");

    $( ".resultDiv2" ).append("<p style='direction:rtl;' class='font-fa black-text'>قیمت di از فرمول di=Xbri-A که A="+A+" میباشد به دست می آید.</p>");
    $( ".resultDiv2" ).append("<p><i class='material-icons' >functions</i> fi = n  = "+sumArr(fi)+"</p>");
    $( ".resultDiv2" ).append("<p><i class='material-icons' >functions</i> fidi =  "+sumArr(fidi)+"</p>");
    $( ".resultDiv2" ).append("<p>avrg = "+(A+(sumArr(fidi)/sumArr(fi)))+"</p>");
        //print table using upd json
    $('.resultTable2').createTable(data,{});
}


function solveEqualLevelSpace()
{
   //prepareing for making the result table
   var data = [];
   var I = parseFloat(xi[0].trim().split("-")[1]) - parseFloat(xi[0].trim().split("-")[0]);
   var A = parseFloat((parseFloat(xi[parseInt(xi.length/2)].trim().split("-")[1]) + parseFloat(xi[parseInt(xi.length/2)].trim().split("-")[0]))/2);
   xbri[parseInt(xi.length/2)]= A;
   if(xi.length%2 == 0)
   {
       A = parseFloat((parseFloat(xi[parseInt(xi.length/2) -1].trim().split("-")[1]) + parseFloat(xi[parseInt(xi.length/2)-1].trim().split("-")[0]))/2);
       xbri[parseInt(xi.length/2) -1]= A;
   }


   for(var i=0;i<xi.length;i++)
   {
       xbri[i] = parseFloat((parseFloat(xi[i].trim().split("-")[1]) + parseFloat(xi[i].trim().split("-")[0]))/2); // making sure calculating the correct result
       fi[i] = parseFloat(fi[i]);

       di[i] = ((xbri[i] - parseFloat(A))/I); // cant minus none float and float
       
       fidi[i] = fi[i]*di[i];
       var tmp = {"xi": xi[i],"xbri":xbri[i],"fi": fi[i],"di": di[i],"fi_di": fidi[i]};
       data.push(tmp);   
   }
       //find A in the middle of the xi


   
   
   resetResultsOutput(3); //remove last result

   $('.resultHeaderDiv3').append("<h3 style='direction:rtl;' class='font-fa blue-text'>به روش تغیر مبدا و واحد: </h3>");

   $( ".resultDiv3" ).append("<p style='direction:rtl;' class='font-fa black-text'>قیمت di از فرمول di=(Xbri-A)/I که A="+A+" میباشد به دست می آید.</p>");
   $( ".resultDiv3" ).append("<p><i class='material-icons' >functions</i> I  = "+I+"</p>");
   $( ".resultDiv3" ).append("<p><i class='material-icons' >functions</i> fi = n  = "+sumArr(fi)+"</p>");
   $( ".resultDiv3" ).append("<p><i class='material-icons' >functions</i> fidi =  "+sumArr(fidi)+"</p>");
   $( ".resultDiv3" ).append("<p>avrg = "+(A+(sumArr(fidi)/sumArr(fi))*I)+"</p>");
       //print table using upd json
   $('.resultTable3').createTable(data,{});
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
function showResult()
{
    //close getDataModal
    $('#getDataModal').modal('close');
        
    // Open the result modal
    $('#resultModal').modal('open');
}

///////////////////////////////////////
function sumArr(arr)
{
    var total = 0;
    for(var i=0;i<xi.length;i++)
    {
        total += arr[i];
    }
    return total;
}

function resetResultsOutput(index)
{
    if(index == 1)
    {
        $( ".resultHeaderDiv1" ).text(""); //remove last result
        $( ".resultTable1" ).text(""); //remove last result
        $( ".resultDiv1" ).text(""); //remove last result
    }

    else if(index ==2)
    {
        $( ".resultHeaderDiv2" ).text(""); //remove last result
        $( ".resultTable2" ).text(""); //remove last result
        $( ".resultDiv2" ).text(""); //remove last result
    }
    else if(index == 3)
    
    {
        $( ".resultHeaderDiv3" ).text(""); //remove last result
        $( ".resultDiv3" ).text(""); //remove last result
        $( ".resultTable3" ).text(""); //remove last result
    }
    
}
