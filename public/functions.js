var addNew=function(dom) {
    var matched=dom.attr("id").match(/_-_/g);
    if (!(matched && matched.length>=2) && dom.attr("id")!=="mainSettings") {
        $("#addType1").parent().show();
    } else {
        $("#addType1").parent().hide();
    }
    $('#myModal').modal("show");
    $("#addType2").attr("checked","checked");
    $("#GoIName").val("");
    $("#GoIID").val(dom.attr("id"));
};
var showConf=function() {
    $.ajax({
        type: 'post',
        url: '/getJSON',
        dataType: 'json',
        timeout: 5000,
        data: $("#dataForm").serialize(),
        success: function(re) {
            var tmp=[];
            for (var i in re["tunnels"]) {
                tmp.push(i);
            }
            $("#tunnelsList").val(tmp.join(" "));
            $("#confText").val(jsyaml.dump(re));
        }
    });
    $('#confirmConf').modal("show");
};
var commitConf=function() {
    $.ajax({
        type: 'post',
        url: '/commit',
        dataType: 'text',
        timeout: 5000,
        data: {"conf": $("#confText").val(), "tunnelsList": $("#tunnelsList").val()},
        success: function(re) {

        }
    });
    $('#confirmConf').modal("hide");
};
var getInput=function(k,v) {
    var tmp=k.concat();
    var id=k.join("_-_");
    if ($("#"+id).length) {
        return false;
    }
    var name=tmp.shift()+(tmp.length?"["+tmp.join("][")+"]":"");
    return $("<div class=\"form-group\"><label for=\""+id+"\" class=\"col-sm-2 control-label\">"+k[k.length-1]+"</label><div class=\"col-sm-10\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" id=\""+id+"\" name=\""+name+"\" placeholder=\""+k[k.length-1]+"\" value=\""+v+"\" /><div class=\"input-group-addon\" onclick=\"confirm('确认删除？') && $(this).parent().parent().parent().remove();\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></div></div></div></div>");
};
var doAdd=function() {
    if ($("#GoIName").val()==="") {
        $("#GoIName").focus();
        return false;
    }
    var k=$("#GoIID").val()=="mainSettings"?[]:$("#GoIID").val().split("_-_");
    k.push($("#GoIName").val());
    if ($("input[name='addType']:checked").val()==="panel") {
        $("#"+$("#GoIID").val()).append(getPanel(k,""));
    } else {
        $("#"+$("#GoIID").val()).append(getInput(k,""));
    }
    $('#myModal').modal("hide");
};
var getPanel=function(k,v) {
    var id=k.join("_-_");
    if ($("#"+id).length) {
        return false;
    }
    var matched=id.match(/_-_/g);
    return $(((matched && matched.length==1)?"<div class=\"col-md-6\">":"")+"<div class=\"panel panel-default\"><div class=\"panel-heading\"><h3 class=\"panel-title\">"+k[k.length-1]+"</h3>"+"<span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\" style=\"float: right; margin-top: -18px;"+((matched && matched.length>=1)?" margin-right: 19px;":"")+"\" onclick=\"addNew($(this).parent().next('div'));\"></span>"+((matched && matched.length>=1)?"<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\" style=\"float: right; margin-top: -17px;\" onclick=\"confirm('确认删除？') && $(this).parent().parent()"+((matched && matched.length==1)?".parent()":"")+".remove();\"></span>":"")+"</div><div class=\"panel-body\" id=\""+id+"\"></div></div>"+(matched?"</div":""));
};
$(function() {
    $.ajax({
        type: 'get',
        url: '/get',
        dataType: 'text',
        timeout: 5000,
        success: function(re) {
            var data=jsyaml.load(re);
            $.each(data, function(k,v) {
                if (typeof v!=="object") {
                    $("#mainSettings").append(getInput([k],v));
                } else {
                    $("#dataForm").append(getPanel([k],v));
                    $.each(v,function(k1,v1) {
                        if (typeof v1==="object") {
                            $("#"+k).append(getPanel([k,k1],v1));
                            $.each(v1,function(k2,v2) {
                                if (typeof v2!=="object") {
                                    $("#"+[k,k1].join("_-_")).append(getInput([k,k1,k2],v2));
                                } else {
                                    $("#"+[k,k1].join("_-_")).append(getPanel([k,k1,k2],v2));
                                    $.each(v2,function(k3,v3) {
                                        if (typeof v3!=="object") {
                                            $("#"+[k,k1,k2].join("_-_")).append(getInput([k,k1,k2,k3],v3));
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
            $("#dataForm").append($('<button type="button" class="btn btn-primary" onclick="showConf();">预览配置文件</button>'))
        }
    });
});