package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String callingname;

    private String fullname;

    private String nic;

    private LocalDate dobirth;

    private String mobile;

    private String land;

    private String email;

    private String photo;

    @Lob
    private String address;

    private LocalDate dorecruit;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    private Civilstatus civilstatus;

    @ManyToOne
    private Employeestatus employeestatus;

    @ManyToOne
    private Designation designation;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Categorization> categorizationList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Distribution> distributionList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Dryering> dryeringList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Grinding> grindingList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Packing> packingList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Permenting> permentingList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Tasting> tastingList;

    @JsonIgnore
    @ManyToMany(mappedBy = "employeeList")
    private List<Withering> witheringList;


    public Employee(Integer id){
        this.id = id;
    }

    public Employee(Integer id, String code, Nametitle nametitle, String callingname, String photo){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.callingname = callingname;
        this.photo = photo;
    }

}