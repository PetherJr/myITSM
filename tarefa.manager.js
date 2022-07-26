
class TarefaManager {

  constructor() {
    this.tarefas = [];
    this.configurarLocalStorage();
    this.carregarDados();
  }


  configurarLocalStorage() {
    if (localStorage.getItem('tarefas') == null) {
      localStorage.setItem('tarefas', JSON.stringify([]));
    }
  }

  carregarDados() {
    var dados = localStorage.getItem('tarefas');
    this.tarefas = JSON.parse(dados) || [];
    this.tarefas = this.tarefas.map(tarefa => Tarefa.fromLocalStorage(tarefa));
  }
  salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
  }

  /**
   * @param {String} titulo 
   * @param {Date} dataDeTermino 
   */
  cadastrar(titulo, dataDeTermino) {
    var tarefa = new Tarefa(new Date().getTime(), titulo, dataDeTermino, false);
    this.tarefas.push(tarefa);
    this.salvarDados();
  }

  /**
   * @param {Number} id 
   * @param {String} titulo 
   * @param {Date} dataDeTermino 
   * @param {Boolean} estahConcluida 
   */
  editar(id, titulo, dataDeTermino, estahConcluida) {
    var tarefa = this.encontrarTarefaPorId(id);
    tarefa.titulo = titulo;
    tarefa.dataDeTermino = dataDeTermino;
    tarefa.estahConcluida = estahConcluida;
    this.salvarDados();
  }

  /**
   * @param {Number} id 
   * @returns 
   */
  encontrarTarefaPorId(id) {
    return this.tarefas.find(t => t.id == id);
  }

  /**
   * @param {Number} id 
   */
  excluir(id) {
    var i = this.tarefas.findIndex(tarefa => tarefa.id == id);
    this.tarefas.splice(i, 1);
    this.salvarDados();
  }

  /**
   * @param {Number} id 
   */
  alternarSituacao(id) {
    var tarefa = this.encontrarTarefaPorId(id);
    tarefa.alternarSituacao();
    this.salvarDados();
  }
}
