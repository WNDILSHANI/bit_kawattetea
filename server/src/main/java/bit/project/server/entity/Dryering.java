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
public class Dryering{
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
    private Dryeringstatus dryeringstatus;

    @ManyToOne
    private Categorizedmaterial categorizedmaterial;

    @OneToMany(mappedBy="dryering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dryeringdryeringline> dryeringdryeringlineList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="dryeringemployee",
        joinColumns=@JoinColumn(name="dryering_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;


    public Dryering(Integer id){
        this.id = id;
    }

    public Dryering(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}