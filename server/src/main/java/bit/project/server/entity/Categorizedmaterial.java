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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Categorizedmaterial{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal weight;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Categorization categorization;

    @ManyToOne
    private Material material;

    @ManyToOne
    private Catmaterialstatus catmaterialstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "categorizedmaterial")
    private List<Dryering> categorizedmaterialDryeringList;

    @JsonIgnore
    @OneToMany(mappedBy = "categorizedmaterial")
    private List<Gradebatch> categorizedmaterialGradebatchList;

    @JsonIgnore
    @OneToMany(mappedBy = "categorizedmaterial")
    private List<Grinding> categorizedmaterialGrindingList;

    @JsonIgnore
    @OneToMany(mappedBy = "categorizedmaterial")
    private List<Permenting> categorizedmaterialPermentingList;

    @JsonIgnore
    @OneToMany(mappedBy = "categorizedmaterial")
    private List<Tasting> categorizedmaterialTastingList;

    @JsonIgnore
    @OneToMany(mappedBy = "categorizedmaterial")
    private List<Withering> categorizedmaterialWitheringList;


    public Categorizedmaterial(Integer id){
        this.id = id;
    }

    public Categorizedmaterial(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}