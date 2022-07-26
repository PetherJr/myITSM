
class Tarefa {
  constructor(id, titulo, dataDeTermino, estahConcluida) {
    this.id = id;
    this.titulo = titulo;
    this.dataDeTermino = dataDeTermino;
    this.estahConcluida = estahConcluida;
  }

  static fromLocalStorage(tarefa) {
    var nova = new Tarefa(tarefa.id, tarefa.titulo, tarefa.dataDeTermino, tarefa.estahConcluida);
    nova.dataDeTermino = new Date(tarefa.dataDeTermino);
    return nova;
  }

  alternarSituacao() {
    this.estahConcluida = !this.estahConcluida;
  }
}
