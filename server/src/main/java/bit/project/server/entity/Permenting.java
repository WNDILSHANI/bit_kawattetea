package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Permenting{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tostart;

    private LocalDateTime toend;

    private BigDecimal initweight;

    private BigDecimal finalweight;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Permentingstatus permentingstatus;

    @ManyToOne
    private Categorizedmaterial categorizedmaterial;

    @OneToMany(mappedBy="permenting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Permentingpermentingmachine> permentingpermentingmachineList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="permentingemployee",
        joinColumns=@JoinColumn(name="permenting_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;


    public Permenting(Integer id){
        this.id = id;
    }

    public Permenting(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}