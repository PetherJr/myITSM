
var manager = null;


var editando = null;

/**

 * @param {Date} data 
 * @returns
 */
function formatarData(data) {
  return `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`;
}

/**
 * Formata a data para string no formato do input do tipo
 * datetime-local.
 * 
 * @param {Date} data A data que será formatada.
 * @returns A data formatada como string.
 */
function formatarDataParaInput(data) {
  var y = data.getYear() + 1900;
  var m = data.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = data.getDate();
  d = d < 10 ? '0' + d : d;
  var h = data.getHours();
  h = h < 10 ? '0' + h : h;
  var n = data.getMinutes();
  n = n < 10 ? '0' + n : n;
  return `${y}-${m}-${d}T${h}:${n}`;
}

/**

 * @param {Date} data1 
 * @param {Date} data2 
 * @returns 
 */
function diferencaDatas(data1, data2) {
  var d = data1.getTime() - data2.getTime();
  var dias = d / 1000 / 60 / 60 / 24;
  return dias.toFixed(1);
}

/**

 * @param {Number} d 
 * @returns {String}
 */
function formatarDiferencaDatas(d) {
  var t = d - Math.floor(d);
  var h = (t * 24).toFixed(0);
  var r = Math.round(d);
  if (r > 0) {
    return `em ${r} dia(s) e ${h} hora(s)`;
  } else if (r == 0) {
    return `em ${h} hora(s)`;
  } else {
    return `há ${r * -1} dia(s)`;
  }
}


function buttonConcluirTarefaClick() {
  var id = this.getAttribute('data-tarefas-id');
  manager.alternarSituacao(id);
  apresentarTarefas();
}


function createButtonConcluir(tarefa) {
  var btn = document.createElement('button');
  btn.classList.add('icon-button');
  if (tarefa.estahConcluida) {
    btn.innerHTML = '🔥';
  } else {
    btn.innerHTML = '✅';
  }
  btn.setAttribute('data-tarefas-id', tarefa.id);
  btn.addEventListener('click', buttonConcluirTarefaClick);
  return btn;
}


function buttonExcluirTarefaClick() {
  var id = this.getAttribute('data-tarefas-id');
  var tarefa = manager.encontrarTarefaPorId(id);
  if (confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`)) {
    manager.excluir(id);
    apresentarTarefas();
  }
}

/**
 * @param {*} tarefa 
 * @returns 
 */
function createButtonExcluir(tarefa) {
  var btn = document.createElement('button');
  btn.classList.add('icon-button');
  btn.innerHTML = '❌';
  btn.setAttribute('data-tarefas-id', tarefa.id);
  btn.addEventListener('click', buttonExcluirTarefaClick);
  return btn;
}

function buttonEditarTarefaClick() {
  var id = this.getAttribute('data-tarefas-id');
  editando = manager.encontrarTarefaPorId(id);
  var header = document.getElementById('form-header');
  header.innerHTML = `<strong>Editando tarefa (${editando.id})</strong>`;
  document.getElementById('titulo').value = editando.titulo;
  document.getElementById('dataDeTermino').value = formatarDataParaInput(editando.dataDeTermino);
  mostrarSidebarForm();
}

/**
 * @param {*} tarefa 
 * @returns 
 */
function createButtonEditar(tarefa) {
  var btn = document.createElement('button');
  btn.classList.add('icon-button');
  btn.innerHTML = '✍';
  if (tarefa.estahConcluida) {
    btn.setAttribute('disabled', 'disabled');
  }
  btn.setAttribute('data-tarefas-id', tarefa.id);
  btn.addEventListener('click', buttonEditarTarefaClick);
  return btn;
}

function buttonCancelarFormClick() {
  var form = document.getElementById('form-tarefa');
  alternarSidebarDireita();

  form.reset();
  if (editando != null) {
    var header = document.getElementById('form-header');
    header.innerHTML = '<strong>Cadastrar tarefa</strong>';
    editando = null;
  }
}

/**
 * @returns {Element}
 */
function createButtonCancelar() {
  var btn = document.createElement('button');
  btn.innerHTML = 'Cancelar';
  btn.setAttribute('type', 'button');
  btn.addEventListener('click', buttonCancelarFormClick);
  return btn;
}

function alternarSidebarDireita() {
  document.getElementById('sidebar-estatisticas').classList.toggle('hidden');
  document.getElementById('sidebar-form').classList.toggle('hidden');
  var btnCadastrar = document.getElementById('btn-cadastrar');
  btnCadastrar.innerHTML = document.getElementById('sidebar-estatisticas').classList.contains('hidden') ?
    'Estatísticas' : 'Cadastrar';
}

function mostrarSidebarForm() {
  if (!document.getElementById('sidebar-estatisticas').classList.contains('hidden')) {
    document.getElementById('sidebar-estatisticas').classList.add('hidden');
  }
  if (document.getElementById('sidebar-form').classList.contains('hidden')) {
    document.getElementById('sidebar-form').classList.remove('hidden');
  }
  var btnCadastrar = document.getElementById('btn-cadastrar');
  btnCadastrar.innerHTML = 'Estatísticas';
}

function apresentarTarefas() {
  var ulTarefasAtivas = document.getElementById('ul-tarefas-ativas');
  document.querySelectorAll('#ul-tarefas-ativas li').forEach(no => no.remove());

  var ulTarefasConcluidas = document.getElementById('ul-tarefas-concluidas');
  document.querySelectorAll('#ul-tarefas-concluidas li').forEach(no => no.remove());
  

  for (var tarefa of manager.tarefas) {
    var li = document.createElement('li');
    li.classList.add('lista__item');
    var divLinha1 = document.createElement('div');

    var data = formatarData(tarefa.dataDeTermino);
    var diff = formatarDiferencaDatas(diferencaDatas(tarefa.dataDeTermino, new Date()));
    var small = document.createElement('small');
    small.style.color = '#777';
    small.innerHTML = `⏰ ${data} - ${diff}`;

    var divTitulo = document.createElement('div')
    divTitulo.innerHTML = tarefa.titulo;

    divLinha1.appendChild(small);
    divLinha1.appendChild(divTitulo);
    li.appendChild(divLinha1);

    var divLinha2 = document.createElement('div');
    divLinha2.classList.add('button-group');
    btnConcluir = createButtonConcluir(tarefa);
    btnExcluir = createButtonExcluir(tarefa);
    btnEditar = createButtonEditar(tarefa);
    divLinha2.appendChild(btnConcluir);
    divLinha2.appendChild(btnExcluir);
    divLinha2.appendChild(btnEditar);

    li.appendChild(divLinha2);

    if (tarefa.estahConcluida) {
      ulTarefasConcluidas.appendChild(li);
    } else {
      ulTarefasAtivas.appendChild(li);
    }
  }

}

/**
 * @param {*} e 
 */
function formSubmit(e) {
  e.preventDefault();
  var inputTitulo = document.getElementById('titulo');
  var inputData = document.getElementById('dataDeTermino');
  var titulo = inputTitulo.value;
  var data = inputData.value;
  if (titulo == '' || data == '') {
    alert('É necessário informar os dados da tarefa');
  } else {
    if (editando == null) {
      manager.cadastrar(titulo, new Date(data));
    } else {
      manager.editar(editando.id, titulo, new Date(data), editando.estahConcluida);
      editando = null;
    }
    alternarSidebarDireita();
    this.reset();
    apresentarTarefas();
  }
}


function createApp() {
  manager = new TarefaManager();

  var btnCadastrar = document.getElementById('btn-cadastrar');
  btnCadastrar.addEventListener('click', function () {
    alternarSidebarDireita();
  })

  var form = document.getElementById('form-tarefa')
  form.addEventListener('submit', formSubmit);

  var btnCancelar = document.getElementById('btn-cancelar');
  btnCancelar.addEventListener('click', buttonCancelarFormClick);
}

function documentLoad() {
  createApp();
  apresentarTarefas();
}

document.addEventListener('DOMContentLoaded', documentLoad);
