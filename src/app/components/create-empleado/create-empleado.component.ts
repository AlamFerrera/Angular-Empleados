import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = '';
  btnValue = '';

  constructor(private fb: FormBuilder, private _empleadoService: EmpleadoService, private router: Router,
              private toastr: ToastrService, aRoute:ActivatedRoute) { 
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['',Validators.required]
    });
    this.id = aRoute.snapshot.paramMap.get('id');
  }

  agregarEmpleado(){
    this.submitted = true;

    if(this.createEmpleado.invalid){
      return;
    }

    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.agregarEmpleado(empleado).then(() => {
      this.toastr.success('Registro exitoso !', 'Empleado Registrado',{
        positionClass: 'toast-top-center'
      });
      //this.loading = false;
      this.router.navigate(['list-empleados']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }

  esEditar(){
    this.titulo = "Agregar Empleado";
    this.btnValue = "Crear Empleado";
    if(this.id !== null){
      this.loading = true;
      this.titulo = "Editar Empleado";
      this.btnValue = "Modificar Empleado";
       this._empleadoService.getEditEmpleado(this.id).subscribe(data=> {
         this.loading = false;
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario']
        });
      });
    }
  }

  AddOrEdit(){
    this.submitted = true;
    if(this.createEmpleado.invalid){
      return;
    }

    if(this.id === null){
      this.agregarEmpleado();
    }
    else{
      this.actualizar(this.id);
    }
  }

  actualizar(p_id: string){
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.actualizarEmpleado(p_id,empleado).then(()=> {
        this.loading = false;
        this.toastr.info("Empleado modificado con exito!", "Empleado Modificado",{
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/list-empleados']);
    }).catch(error => {
        console.log( error);
    });
  }

  ngOnInit(): void {
    this.esEditar();
  }

}
