// Ínicio dos Imports
import { Component, NgZone, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar'

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendamentosService } from '../../services/agendamentos.service';
import { Agendamentos } from '../../models/agendamentos.model';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';
// Fim dos Imports

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatButtonModule, 
    MatDialogModule, MatCheckboxModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  title = 'Home'

  constructor(private ngZone: NgZone, private agendamentosService: AgendamentosService, private snackBar : MatSnackBar,
    private dialog: MatDialog) { }

  @ViewChild(MatTable) table!: MatTable<Agendamentos>

  // Palavras animadas
  palavraAnimada: string = ''
  words: string[] = ['AGENDAMENTOS', 'ORÇAMENTOS']
  currentWordIndex: number = 0
  letterIndex: number = 0
  isDeleting: boolean = false
  interval: any
  timeout: any
  // Fim das palavras animadas

  // Referente às colunas das tabelas
  displayedColumns: string[] = ['select', 'position', 'nome', 'telefone', 'placa', 'servico', 'preco']
  agendamentos: Agendamentos[] = []
  dataSources = new MatTableDataSource<Agendamentos>(this.agendamentos)

  adjustTextArea(event: any): void {
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + 'px'
  }

  ngOnInit() {
    this.startAnimation()
    this.loadAgendamentos()
  }

  ngOnDestroy(): void {
    this.clearTimes()
  }

  clearTimes(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  // Início da animação das palavras
  startAnimation(): void {
    this.clearTimes()
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          const currentFullWord = this.words[this.currentWordIndex]
          if (this.isDeleting) {
            if (this.letterIndex > 0) {
              this.palavraAnimada = currentFullWord.substring(0, --this.letterIndex)
            } else {
              this.isDeleting = false
              this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length
              this.timeout = setTimeout(() => {
                this.startAnimation()
              }, 1000)
            }
          } else {
            if (this.letterIndex < currentFullWord.length) {
              this.palavraAnimada = currentFullWord.substring(0, ++this.letterIndex)
            } else {
              this.isDeleting = true
              this.timeout = setTimeout(() => {
                this.startAnimation()
              }, 1000)
            }
          }
        })
      }, 200)
    });
  }
  // Fim da animação das palavras

  loadAgendamentos() {
    this.agendamentosService.getAgendamentos().subscribe((data: Agendamentos[]) => {
      this.agendamentos = data
      this.dataSources.data = this.agendamentos
      
      if (this.table) {
        this.table.renderRows()
      }
    });
  }

  selection = new SelectionModel<Agendamentos>(true, [])

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSources.data.length
    return numSelected === numRows
  }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSources.data.forEach(row => this.selection.select(row))
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }
    for (const agendamento of this.dataSources.data) {
      console.log(agendamento);
    }    
  }

  checkboxLabel(row?: Agendamentos): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${(row.position ?? 0) + 1}`
  }  

  addNewAgendamento() {
    const newAgendamento: Agendamentos = {
      position: this.dataSources.data.length + 1,
      nome: '',
      telefone: '',
      placa: '',
      servico: '',
      data: '',
      horario: '',
      preco: '',
      editMode: true
    };
    this.dataSources.data.push(newAgendamento)
    this.dataSources._updateChangeSubscription()
    this.dataSources.data.forEach((agendamento, index) => {
      agendamento.position = index + 1
    });

    this.table.renderRows()
  }

  saveAgendamento(element: Agendamentos) {
    element = { ...element }
  }

  saveNewAgendamento(element: Agendamentos) {
    if(!element._id) {
    this.agendamentosService.saveAgendamento(element).subscribe((response) => {
      element._id = response._id
      element.editMode = false
      this.table.renderRows()
    })
  }
}

  onEnter(element: Agendamentos) {
    // Transformando todas as letras em maiúsculas
    element.placa = element.placa.toUpperCase()

  // Verifica se o formato da placa está correto
  const placaRegex = /^[A-Z]{3}-[0-9]{1}[A-Z0-9]{1}[0-9]{2}$/

  if (!placaRegex.test(element.placa)) {
    this.snackBar.open('A placa deve estar no formato AAA-0000 ou AAA-0A00', 'Fechar', {
      duration: 5000, // duração da mensagem
      horizontalPosition: 'center', // posição horizontal
      verticalPosition: 'top', // posição vertical
      panelClass: ['error-snackbar'] // classe CSS personalizada
    });
    return;
  }

    if(!element._id) {
      this.createAgendamento(element)
    } else {
      this.updateAgendamento(element)
    }
  }

  createAgendamento(element: any) {
    this.agendamentosService.saveAgendamento(element).subscribe(
      (res: any) => {
        if(res && res._id) {
          element._id = res._id
          element.editMode = false
          console.warn('Agendamento Salvo!', res)
          this.table.renderRows()
          this.showSuccessMessage('Agendamento realizado com sucesso')
        }
      }, (error: any) => {
        console.error('Erro ao salvar agendamento', error)
      }
    )
  }

  isEditMode: boolean = false
  currentEditingElement: Agendamentos | null = null

  saveEdits(element: Agendamentos) {
    this.agendamentosService.updateAgendamento(element._id!, element).subscribe(() => {
      element.editMode = false
      this.table.renderRows()
    })
  } 

  updateAgendamento(element: Agendamentos) {
    if(!element._id) {
      console.warn('Erro ao encontrar ID para atualizar agendamento.')
      return
    }

    this.agendamentosService.updateAgendamento(element._id, element).subscribe(
      (res: any) => {
        element.editMode = false
        console.warn('Agendamento atualizado', res)
        this.showSuccessMessage('Edição realizada com sucesso')
      }, (error) => {
        console.error('Erro ao atualizar agendamento', error)
      }
    )
  }

  editAgendamento(element: Agendamentos) {
    element.editMode = !element.editMode
  }

  editSelectedElement(element: Agendamentos) {
    const selectedAgendamento = this.selection.selected[0]

    if(!selectedAgendamento) {
      alert('Agendamento não encontrado!')
      return
    }

    this.dataSources.data.forEach((ag: Agendamentos) => {
    })

    selectedAgendamento.editMode = true
    this.currentEditingElement = selectedAgendamento

    if(this.selection.selected.length === 0) {
      alert('Nenhum agendamento para editar')
    }
  }

  deleteAgendamento(element: Agendamentos) {
    // Abre o diálogo de confirmação
    const dialogRef = this.dialog.open(ConfirmarDialogComponent, {
      width: '300px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Executa a lógica de exclusão do front-end
        const index = this.dataSources.data.indexOf(element)
        if (index > -1) {
          this.dataSources.data.splice(index, 1)
          this.dataSources._updateChangeSubscription
        }
  
        // Exclui o agendamento do banco de dados
        this.agendamentosService.deleteAgendamento([element._id!]).subscribe({
          next: (response) => {
            console.warn('Agendamento removido!', response)
            this.showSuccessMessage('Agendamento removido com sucesso'); 
          },
          error: (error) => {
            console.error('Erro ao remover agendamento!', error)
          }
        });
      } else {
        console.log('Ação de exclusão cancelada')
      }
    });
  }
  
  deleteSelectedAgendamento() {
    const selectedIds = this.selection.selected.map((element) => element._id!)
  
    if (selectedIds.length > 0) {
      // Abre o diálogo de confirmação
      const dialogRef = this.dialog.open(ConfirmarDialogComponent, {
        width: '300px'
      });
  
      // Verifica a resposta do diálogo
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Se confirmado, realiza a exclusão dos agendamentos selecionados
          this.agendamentosService.deleteAgendamento(selectedIds).subscribe(
            (response) => {
              console.warn('Agendamento(s) removido(s) com sucesso!', response)
  
              // Remove os agendamentos excluídos do front-end
              if (Array.isArray(selectedIds)) {
                this.dataSources.data = this.dataSources.data.filter((item: Agendamentos) => 
                  !selectedIds.includes(item._id!))
                this.selection.clear()
                this.table.renderRows()
              }              
  
              this.showSuccessMessage('Agendamentos removidos com sucesso!')
            },
            (error) => {
              console.error('Erro ao remover', error)
            }
          );
        } else {
          console.log('Ação de exclusão múltipla cancelada')
        }
      });
    } else {
      console.warn('Nenhum agendamento selecionado')
    }
  }  

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    })
  }
}

export { Agendamentos }